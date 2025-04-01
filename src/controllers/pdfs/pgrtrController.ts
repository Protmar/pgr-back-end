import dotenv from 'dotenv';
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { Cliente } from "../../models/Cliente";
import { Empresa } from "../../models";
const { buildDocumentoBase } = require("../../report-builder/documento-base/documento-base-builder");
const { generatePdf } = require("../../report-builder/utils/report-utils")

dotenv.config();

export const pgrtrReportController = {
    getPGRReport: async (
        req: AuthenticatedUserRequest,
        res: Response
    ) => {
        const { empresaId } = req.user!;
        try {
            const reportOptions = await pgrtrReportController.getReportOptions(
                Number(empresaId),
            );

            const docDefinitions = await buildDocumentoBase(reportOptions);

            const pdfBuffer = await generatePdf(docDefinitions);

            res.status(200).send(pdfBuffer);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    //COLOCAR ID DO GES A SEGUIR NOS PARAMETROS
    getReportOptions: async ( empresaId: number) => {
        const s3url = process.env.AWS_S3_URL;
        const reportConfig = {
            noImageUrl: `${s3url}noImage.jpg`,
        };

        const cliente = await Cliente.findOne({

            where: { id: 3 },

        });

        if (!cliente) {
            throw new Error("Acesso restrito");
        }

        //É necessário buscar na empresa o logo e marca d'água.
        const empresa = await Empresa.findByPk(empresaId);


        return {
            reportConfig,
            cliente,
            empresa,
            s3url,
        };
    },
}


