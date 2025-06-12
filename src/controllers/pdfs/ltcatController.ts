import dotenv from 'dotenv';
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { Cliente } from "../../models/Cliente";
import { Empresa } from "../../models";
import { getFileToS3 } from '../../services/aws/s3';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

const { buildDocumentoBase } = require("../../report-builder/documento-base-LTCAT/documento-base-builder");
const { generatePdf } = require("../../report-builder/utils/report-utils");

dotenv.config();

export const ltcatReportController = {
    getLTCATReport: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;
    const { clientId, gesIds, servicoId } = req.body;

    try {
        const reportOptions = await ltcatReportController.getReportOptions(
            Number(empresaId),
            Number(clientId),
            gesIds,
            servicoId
        );

        const docDefinitions = await buildDocumentoBase(reportOptions);

        const filesPDFs = await Promise.all(
            docDefinitions.resultadoLTCAT.pdfs.map(async (e: any) => {
                const file = await getFileToS3(e.url); // pega URL temporária da AWS
                const response = await axios.get(file.url, { responseType: 'arraybuffer' });
                return response.data; // buffer do PDF
            })
        );

        // 1. Gera o PDF principal
        const mainPdfBuffer = await generatePdf(docDefinitions.docDefinitions);

        // 2. Carrega o PDF principal
        const mainPdfDoc = await PDFDocument.load(mainPdfBuffer);

        // 3. Anexa os PDFs vindos da AWS S3
        for (const pdfBuffer of filesPDFs) {
            const pdfToAppend = await PDFDocument.load(pdfBuffer);
            const copiedPages = await mainPdfDoc.copyPages(pdfToAppend, pdfToAppend.getPageIndices());
            copiedPages.forEach((page) => mainPdfDoc.addPage(page));
        }

        // 4. Salva o PDF final com anexos
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

        const cliente = await Cliente.findOne({
            where: { id: clientId },
        });

        if (!cliente) {
            throw new Error("Acesso restrito");
        }

        const empresa = await Empresa.findByPk(empresaId);

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