import dotenv from 'dotenv';
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { Cliente } from "../../models/Cliente";
import { Empresa } from "../../models";
import { getFileToS3 } from '../../services/aws/s3';
import { getNameDocBaseByServicoPGR } from '../../services/servicos';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import ART from '../../models/ART';

// const { buildDocumentoBase } = require("../../../../../gerarLaudos/pgr/")

//const { buildDocumentoBase } = require("../../report-builder/documento-base-PGR/documento-base-builder");
const { generatePdf } = require("../../report-builder/utils/report-utils");

dotenv.config();

export const pgrtrReportController = {
    getPGRTRReport: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;
        const { clientId, gesIds, servicoId } = req.body;

        try {
            // Etapa 1: Preparar reportOptions + buscar base_document_url em paralelo
            const [reportOptions, nameDocumentBaseResponse] = await Promise.all([
                pgrtrReportController.getReportOptions(
                    Number(empresaId),
                    Number(clientId),
                    gesIds,
                    servicoId
                ),
                getNameDocBaseByServicoPGR(Number(empresaId), Number(servicoId))
            ]);

            // Etapa 2: Gerar documento principal e baixar documento base (se existir), em paralelo
            const { data: lambdaResponse } = await axios.post(
                "https://4zo0pg6c0g.execute-api.us-east-1.amazonaws.com/pgrtr-generate/get-data-pgrtr",
                reportOptions
            );

            // 'body' vem como string JSON
            const parsedBody = JSON.parse(lambdaResponse.body);

            // Agora pegamos o documento real
            const docDefinitions = parsedBody.doc;

            // Adiciona bordas e elipse de rodapé após receber o doc do Lambda
            // Adiciona bordas e elipse de rodapé com número da página após receber o doc do Lambda
            docDefinitions.background = (currentPage: number, pageSize: any) => {
                const margin = 25;
                const endWidth = pageSize.width - 25;
                const endHeight = pageSize.height - 25;

                return [
                    {
                        canvas: [
                            { type: "line", x1: margin, y1: margin, x2: endWidth, y2: margin, lineWidth: 0.5 },
                            { type: "line", x1: margin, y1: margin, x2: margin, y2: endHeight, lineWidth: 0.5 },
                            { type: "line", x1: margin, y1: endHeight, x2: endWidth, y2: endHeight, lineWidth: 0.5 },
                            { type: "line", x1: endWidth, y1: margin, x2: endWidth, y2: endHeight, lineWidth: 0.5 },
                            { type: "ellipse", x: pageSize.width / 2, y: endHeight - 10, color: "#40618b", fillOpacity: 0.75, r1: 25, r2: 25 },
                        ],
                    },
                ];
            };

            // Adiciona número da página no centro da elipse
            docDefinitions.footer = (currentPage: number, pageCount: number) => {
                return {
                    margin: [0, 0, 0, 10],
                    columns: [
                        { text: '' }, // espaço à esquerda
                        {
                            text: currentPage.toString(),
                            alignment: 'center',
                            color: '#FFFFFF',
                            fontSize: 14,
                            bold: true,
                            margin: [0, 30, 0, 0], // ajusta posição vertical para centralizar dentro da elipse
                        },
                        { text: '' }, // espaço à direita
                    ],
                };
            };



            // Passa para generatePdf
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

            const ARTs = await ART.findAll({
                where: { empresa_id: Number(empresaId), servico_id: Number(servicoId) }
            });

            // Ordena ARTS por descrição
            ARTs.sort((a, b) =>
                (a.dataValues.descricao || "").localeCompare(b.dataValues.descricao || "")
            );

            if (ARTs.length > 0) {
                const finalPdfDoc = await PDFDocument.create();

                // Copia todas as páginas do mainPdfDoc
                const mainPages = await finalPdfDoc.copyPages(mainPdfDoc, mainPdfDoc.getPageIndices());
                mainPages.forEach(page => finalPdfDoc.addPage(page));

                // Adiciona todas as ARTS no final
                for (const art of ARTs) {
                    const key = art.dataValues.url_imagem;
                    if (!key) continue; // pula se não houver URL

                    const fileDocumentoART = await getFileToS3(key); // agora é sempre string
                    const artPdfBytes = (await axios.get(fileDocumentoART.url, { responseType: "arraybuffer" })).data;
                    const artPdfDoc = await PDFDocument.load(artPdfBytes);
                    const artPages = await finalPdfDoc.copyPages(artPdfDoc, artPdfDoc.getPageIndices());
                    artPages.forEach(page => finalPdfDoc.addPage(page));
                }


                const finalPdfBytes = await finalPdfDoc.save();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
                return res.status(200).send(Buffer.from(finalPdfBytes));
            } else {
                // Caso não haja ARTS, retorna o PDF normalmente
                const finalPdfBytes = await mainPdfDoc.save();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
                return res.status(200).send(Buffer.from(finalPdfBytes));
            }

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
