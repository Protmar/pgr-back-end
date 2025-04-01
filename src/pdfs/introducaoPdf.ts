import PdfPrinter from "pdfmake";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { Request, Response } from "express";
import { getAllGesByServico } from "../services/ges";
import { getFileToS3 } from "../services/aws/s3";
import axios from "axios";
import Sharp from "sharp";
import sizeOf from "image-size";
import { getImageData } from "./getImage";

// Interface definitions remain unchanged
interface AmbienteTrabalho {
    area?: string;
    pe_direito?: string;
    qnt_janelas?: number;
    EquipamentoAmbienteTrabalho?: any[];
    teto?: { descricao?: string };
    edificacao?: { descricao?: string };
    piso?: { descricao?: string };
    parede?: { descricao?: string };
    ventilacao?: { descricao?: string };
    iluminacao?: { descricao?: string };
    informacoes_adicionais?: string;
}

interface Servico {
    id: number;
    descricao_ges: string;
    nome_fluxograma?: string;
    ambientesTrabalhos?: AmbienteTrabalho[];
    responsavel: string;
}

// Function to fetch and process image data
// const getImageData = async (url: string, maxWidth?: number, maxHeight?: number) => {
//     try {
//         const result = await axios.get(url, { responseType: "arraybuffer" });
//         let imgBuffer = Buffer.from(result.data);

//         // Detect the actual image format using Sharp
//         const metadata = await Sharp(imgBuffer).metadata();
//         let img = Sharp(imgBuffer);

//         // Convert to PNG if the format is not supported by pdfmake (e.g., WebP)
//         if (metadata.format === "webp" || metadata.format === "jpeg" || metadata.format === "png") {
//             img = img.png(); // Convert to PNG for compatibility
//         } else {
//             console.warn(`Unsupported image format: ${metadata.format}`);
//             return null;
//         }

//         // Rotate if necessary (based on EXIF orientation)
//         img = img.rotate();

//         // Resize if exceeds maxWidth or maxHeight
//         if (maxWidth || maxHeight) {
//             img = img.resize({
//                 width: maxWidth,
//                 height: maxHeight,
//                 fit: "inside", // Ensure the image fits within the bounds without cropping
//                 withoutEnlargement: true, // Prevent upscaling
//             });
//         }

//         // Convert to buffer and get dimensions
//         const processedBuffer = await img.toBuffer();
//         const dimensions = sizeOf(processedBuffer);

//         return {
//             data: `data:image/png;base64,${processedBuffer.toString("base64")}`,
//             width: dimensions.width,
//             height: dimensions.height,
//         };
//     } catch (error) {
//         console.error("Error processing image:", error);
//         return null;
//     }
// };

export const generatePdfHandler = async (request: Request, response: Response) => {
    const fonts = {
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    };

    const printer = new PdfPrinter(fonts);

    const generateDataTable = async (): Promise<Content[][]> => {
        const servico_id = 7;
        const data: any[] = (await getAllGesByServico(servico_id)) ?? [];

        const tableBody = await Promise.all(
            data.map(async (e): Promise<Content[]> => {
                let imageUrl;
                if(e.nome_fluxograma){
                    imageUrl = e.nome_fluxograma;
                }

                const imageData = imageUrl ? await getImageData(imageUrl, 150, 150) : null;

                return [
                    { text: e.id.toString(), fontSize: 12, alignment: "center", margin: [0, 20] },
                    { text: e.descricao_ges, fontSize: 12, alignment: "center", margin: [0, 20] },
                    imageData
                        ? {
                              image: imageData.data,
                              width: 100,
                              margin: [0, 10],
                              alignment: "center",
                          }
                        : { text: "Sem imagem", fontSize: 12, alignment: "center", margin: [0, 20] },
                    {
                        text: [
                            `• Área: ${e.ambientesTrabalhos?.[0]?.area ?? "N/A"}\n`,
                            `• Pé Direito: ${e.ambientesTrabalhos?.[0]?.pe_direito ?? "N/A"}\n`,
                            `• Quantidade de Janelas: ${e.ambientesTrabalhos?.[0]?.qnt_janelas ?? "N/A"}\n`,
                            `• Quantidade de Equipamentos: ${e.ambientesTrabalhos?.[0]?.EquipamentoAmbienteTrabalho?.length ?? "N/A"}\n`,
                            `• Teto: ${e.ambientesTrabalhos?.[0]?.teto?.descricao ?? "N/A"}\n`,
                            `• Edificação: ${e.ambientesTrabalhos?.[0]?.edificacao?.descricao ?? "N/A"}\n`,
                            `• Piso: ${e.ambientesTrabalhos?.[0]?.piso?.descricao ?? "N/A"}\n`,
                            `• Parede: ${e.ambientesTrabalhos?.[0]?.parede?.descricao ?? "N/A"}\n`,
                            `• Ventilação: ${e.ambientesTrabalhos?.[0]?.ventilacao?.descricao ?? "N/A"}\n`,
                            `• Iluminação: ${e.ambientesTrabalhos?.[0]?.iluminacao?.descricao ?? "N/A"}\n`,
                            `• Informações Adicionais: ${e.ambientesTrabalhos?.[0]?.informacoes_adicionais ?? "N/A"}`,
                        ],
                        fontSize: 10,
                        alignment: "left",
                        margin: [5, 5],
                    },
                    { text: e.responsavel, fontSize: 12, alignment: "center", margin: [0, 20] },
                ];
            })
        );

        return [
            [
                { text: "GES", fontSize: 12, alignment: "center", margin: [0, 20], fillColor: "#2f945d", color: "white" },
                { text: "Descrição GES", fontSize: 12, alignment: "center", margin: [0, 20], fillColor: "#2f945d", color: "white" },
                { text: "Item 31.3.3.2.1\na) Caracterização dos Processos", fontSize: 12, alignment: "center", margin: [0, 20], fillColor: "#2f945d", color: "white" },
                { text: "Item 31.3.3.2.1\na) Caracterização dos Ambientes de Trabalho", fontSize: 12, alignment: "center", margin: [0, 20], fillColor: "#2f945d", color: "white" },
                { text: "Responsável", fontSize: 12, alignment: "center", margin: [0, 20], fillColor: "#2f945d", color: "white" },
            ],
            ...tableBody,
        ];
    };

    try {
        const dataTable = await generateDataTable();

        const docDefinitions: TDocumentDefinitions = {
            defaultStyle: { font: "Helvetica" },
            pageMargins: [40, 40, 40, 70],
            content: [
                {
                    table: {
                        widths: ["20%", "60%", "20%"],
                        body: [
                            [
                                { text: "Logo Cliente", alignment: "center", margin: [0, 20], border: [false, false, true, true] },
                                { text: "INTRODUÇÃO", fontSize: 12, alignment: "center", bold: true, margin: [0, 20], border: [false, false, false, true] },
                                { text: "Logo Firma", alignment: "center", margin: [0, 20], border: [true, false, false, true] },
                            ],
                        ],
                    },
                    margin: [-15, -15],
                },
                {
                    table: {
                        body: dataTable,
                    },
                    margin: [-15, 30],
                },
                
            ],
            background: (currentPage: any, pageSize: any) => {
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
            },
            footer: (currentPage: number, pageCount: number) => {
                return {
                    margin: [0, 20, 0, 0],
                    text: currentPage.toString(),
                    alignment: "center",
                    fontSize: 16,
                    color: "white",
                };
            },
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinitions);
        const chunks: Buffer[] = [];

        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => {
            const result = Buffer.concat(chunks);
            response.setHeader("Content-Type", "application/pdf");
            response.end(result);
        });
        pdfDoc.on("error", (error) => {
            console.error("PDF generation error:", error);
            response.status(500).send("Error generating PDF");
        });

        pdfDoc.end();
    } catch (error) {
        console.error("Error in generatePdfHandler:", error);
        response.status(500).send("Internal Server Error");
    }
};