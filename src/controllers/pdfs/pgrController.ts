import dotenv from 'dotenv';
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { Cliente } from "../../models/Cliente";
import { Empresa } from "../../models";
import { getFileToS3 } from '../../services/aws/s3';
import { getNameDocBaseByServicoPGR } from '../../services/servicos';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

const { buildDocumentoBase } = require("../../report-builder/documento-base-PGR/documento-base-builder");
const { generatePdf } = require("../../report-builder/utils/report-utils");

dotenv.config();

export const pgrReportController = {
    getPGRReport: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;
        const { clientId, gesIds, servicoId } = req.body;

        try {
            // Etapa 1: Preparar reportOptions + buscar base_document_url em paralelo
            const [reportOptions, nameDocumentBaseResponse] = await Promise.all([
                pgrReportController.getReportOptions(
                    Number(empresaId),
                    Number(clientId),
                    gesIds,
                    servicoId
                ),
                getNameDocBaseByServicoPGR(Number(empresaId), Number(servicoId))
            ]);

            // Etapa 2: Gerar documento principal e baixar documento base (se existir), em paralelo
            const docDefinitions = await buildDocumentoBase(reportOptions);
            const generatePdfPromise = generatePdf(docDefinitions);

            let basePdfLoadPromise: Promise<PDFDocument | null> = Promise.resolve(null);

            if (nameDocumentBaseResponse?.dataValues?.base_document_url_pgr) {
                const nameDocumentBase = nameDocumentBaseResponse.dataValues.base_document_url_pgr;
                basePdfLoadPromise = (async () => {
                    const fileDocumentoBase = await getFileToS3(nameDocumentBase.toString());
                    const basePdfBuffer = (await axios.get(fileDocumentoBase.url, { responseType: 'arraybuffer' })).data;
                    return PDFDocument.load(basePdfBuffer);
                })();
            }

            const [mainPdfBuffer, basePdfDoc] = await Promise.all([generatePdfPromise, basePdfLoadPromise]);
            const mainPdfDoc = await PDFDocument.load(mainPdfBuffer);

            // Se houver base, inserir entre página 1 e 2
            if (basePdfDoc) {
                const newPdfDoc = await PDFDocument.create();

                const copiedFirstPage = await newPdfDoc.copyPages(mainPdfDoc, [0]);
                copiedFirstPage.forEach(page => newPdfDoc.addPage(page));

                const basePages = await newPdfDoc.copyPages(basePdfDoc, basePdfDoc.getPageIndices());
                basePages.forEach(page => newPdfDoc.addPage(page));

                const remainingPages = await newPdfDoc.copyPages(
                    mainPdfDoc,
                    mainPdfDoc.getPageIndices().slice(1)
                );
                remainingPages.forEach(page => newPdfDoc.addPage(page));

                const finalPdfBytes = await newPdfDoc.save();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
                return res.status(200).send(Buffer.from(finalPdfBytes));
            }

            // Caso não haja documento base
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

    getReportOptions: async (empresaId: number, clientId: number, gesIds: number[], servicoId: number) => {
        const s3url = process.env.AWS_S3_URL;
        const reportConfig = {
            noImageUrl: `${s3url}noImage.jpg`,
        };

        const [cliente, empresa] = await Promise.all([
            Cliente.findOne({ where: { id: clientId } }),
            Empresa.findByPk(empresaId)
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
