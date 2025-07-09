import dotenv from 'dotenv';
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { Cliente } from "../../models/Cliente";
import { Empresa } from "../../models";

const { buildDocumentoBaseGeneralPDF } = require("../../report-builder/documento-base-general-pgr/documento-base-builder");
const { generatePdf } = require("../../report-builder/utils/report-utils");

dotenv.config();

export const docBasePgrReportController = {
    getDocBasePGRReport: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;
        const { clientId, servicoId, type } = req.body;

        try {
            const reportOptions = await docBasePgrReportController.getReportOptions(
                Number(empresaId),
                Number(clientId),
                servicoId,
                type
            );

            const docDefinitions = await buildDocumentoBaseGeneralPDF(reportOptions);
            const pdfBuffer = await generatePdf(docDefinitions);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
            res.status(200).send(pdfBuffer);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    getReportOptions: async (empresaId: number, clientId: number, servicoId:number, type: string) => {
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
            servicoId,
            typeDocBase: type,
        };
    },
};