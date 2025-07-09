import dotenv from 'dotenv';
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { Cliente } from "../../models/Cliente";
import { Empresa } from "../../models";
import { getFileToS3 } from '../../services/aws/s3';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { getNameDocBaseByServicoLTCAT } from '../../services/servicos';

const { buildDocumentoBase } = require("../../report-builder/documento-base-LTCAT/documento-base-builder");
const { generatePdf } = require("../../report-builder/utils/report-utils");

dotenv.config();

export const ltcatReportController = {
  getLTCATReport: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;
    const { clientId, gesIds, servicoId } = req.body;

    try {
      // Executar buildDocumentoBase e consulta do nome do documento base ao mesmo tempo
      const [reportOptions, nameDocumentBaseResponse] = await Promise.all([
        ltcatReportController.getReportOptions(
          Number(empresaId),
          Number(clientId),
          gesIds,
          servicoId
        ),
        getNameDocBaseByServicoLTCAT(Number(empresaId), Number(servicoId)),
      ]);

      // Em paralelo: gerar o documento base (estrutura) e também iniciar a geração do PDF
      const buildPromise = buildDocumentoBase(reportOptions);
      const [docDefinitions] = await Promise.all([buildPromise]);

      const generatePdfPromise = generatePdf(docDefinitions.docDefinitions);

      const anexosPromise = Promise.all(
        docDefinitions.resultadoLTCAT.pdfs.map(async (e: any) => {
          const file = await getFileToS3(e.url);
          const response = await axios.get(file.url, { responseType: 'arraybuffer' });
          return response.data;
        })
      );

      const basePdfLoadPromise = (async () => {
        const baseUrl = nameDocumentBaseResponse?.dataValues?.base_document_url_ltcat;
        if (!baseUrl) return null;
        const fileDocumentoBase = await getFileToS3(baseUrl.toString());
        const basePdfBuffer = (await axios.get(fileDocumentoBase.url, { responseType: 'arraybuffer' })).data;
        return PDFDocument.load(basePdfBuffer);
      })();

      // Executar tudo em paralelo
      const [mainPdfBuffer, anexos, basePdfDoc] = await Promise.all([
        generatePdfPromise,
        anexosPromise,
        basePdfLoadPromise,
      ]);

      const mainPdfDoc = await PDFDocument.load(mainPdfBuffer);

      // Anexar PDFs adicionais
      const anexosDocs = await Promise.all(anexos.map(pdf => PDFDocument.load(pdf)));
      const copiedPagesList = await Promise.all(anexosDocs.map(doc => mainPdfDoc.copyPages(doc, doc.getPageIndices())));
      copiedPagesList.forEach(pages => pages.forEach(page => mainPdfDoc.addPage(page)));

      // Se houver documento base (pré-modelo)
      if (basePdfDoc) {
        const finalPdfDoc = await PDFDocument.create();

        // Primeira página do main
        const firstPage = await finalPdfDoc.copyPages(mainPdfDoc, [0]);
        firstPage.forEach(page => finalPdfDoc.addPage(page));

        // Documento base
        const basePages = await finalPdfDoc.copyPages(basePdfDoc, basePdfDoc.getPageIndices());
        basePages.forEach(page => finalPdfDoc.addPage(page));

        // Restante do main
        const remainingPages = await finalPdfDoc.copyPages(
          mainPdfDoc,
          mainPdfDoc.getPageIndices().slice(1)
        );
        remainingPages.forEach(page => finalPdfDoc.addPage(page));

        const finalPdfBytes = await finalPdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
        return res.status(200).send(Buffer.from(finalPdfBytes));
      }

      // Se não houver documento base, envia o main com anexos
      const finalPdfBytes = await mainPdfDoc.save();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
      res.status(200).send(Buffer.from(finalPdfBytes));

    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  getReportOptions: async (
    empresaId: number,
    clientId: number,
    gesIds: number[],
    servicoId: number
  ) => {
    const s3url = process.env.AWS_S3_URL;
    const reportConfig = {
      noImageUrl: `${s3url}noImage.jpg`,
    };

    const [cliente, empresa] = await Promise.all([
      Cliente.findOne({ where: { id: clientId } }),
      Empresa.findByPk(empresaId),
    ]);

    if (!cliente) throw new Error("Acesso restrito");

    return {
      reportConfig,
      cliente,
      empresa,
      s3url,
      gesIds,
      servicoId,
    };
  },
};
