const { getAllGesByServico, getCursosInString, getEpisInString, getRacsInString } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

module.exports = {
    buildInventarioRiscos: async (empresa, reportConfig, servicoId, gesIds) => {
        try {

            const createHeaderRow = () => {
                return [
                    [
                        {
                            text: "Identificação de Perigos (Item 1.5.4.3 da NR-01)",
                            fontSize: 12,
                            bold: true,
                            alignment: "center",
                            fillColor: "#000000",
                            color: "white",
                            margin: [0, 6, 0, 0],
                            lineHeight: 1,
                            colSpan: 15
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
                        {
                            text: "Classificação dos Riscos Ocupacionais (Item 1.5.4.4.5 da NR-01)",
                            fontSize: 12,
                            bold: true,
                            alignment: "center",
                            fillColor: "#000000",
                            color: "white",
                            margin: [0, 6, 0, 0],
                            lineHeight: 1,
                            colSpan: 6
                        },
                        {}, {}, {}, {}, {}
                    ],
                    [
                        {
                            text: "Item 1.5.4.3.1 da NR-01",
                            fontSize: 12,
                            bold: true,
                            alignment: "center",
                            fillColor: "#2f945d",
                            color: "white",
                            margin: [0, 6, 0, 0],
                            lineHeight: 1,
                            colSpan: 8
                        },
                        {}, {}, {}, {}, {}, {}, {},
                        {
                            text: "Item 1.5.4.4.4 da NR-01 (critérios de PROBABILIDADE)",
                            fontSize: 12,
                            bold: true,
                            alignment: "center",
                            fillColor: "#2f945d",
                            color: "white",
                            margin: [0, 6, 0, 0],
                            lineHeight: 1,
                            colSpan: 7
                        },
                        {}, {}, {}, {}, {}, {},
                        {
                            text: "Item 1.5.4.4.2 da NR-01 (Nível de Risco Ocupacional)",
                            fontSize: 12,
                            bold: true,
                            alignment: "center",
                            fillColor: "#2f945d",
                            color: "white",
                            margin: [0, 6, 0, 0],
                            lineHeight: 1,
                            colSpan: 6
                        },
                        {}, {}, {}, {}, {}
                    ],
                    [
                        { text: "Nº GES", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Descrição GES", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "AGENTE DE RISCO", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Fator de Risco (eSocial)/Descrição dos Perigos", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Possíveis Lesões ou Agravos à Saúde", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Código eSocial", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Transmitir e-Social", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "FONTE GERADORA OU CIRCUNSTÂNCIA", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Exposição Meio de Propagação / Trajetória", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Intens. / Conc.", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "LT / LE", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Técnica Utilizada", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Exigências da atividade de trabalho", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Item NR", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Medidas de Prevenção Implementadas", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Prob.", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Sev.", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Grau de Risco", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Classe de Risco", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Medidas de Controle Necessárias", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                        { text: "Observação", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" }
                    ]
                ];
            };

            const createTitle = () => {
                console.log("Criando título da seção...");
                return {
                    text: "Inventário de Riscos",
                    fontSize: 18,
                    bold: true,
                    alignment: "center",
                    margin: [0, 30, 0, 10]
                };
            };

            console.log("Criando corpo da tabela...");
            const tableBody = [];

            tableBody.push(createHeaderRow());

            const tableDefinition = {
                table: {
                    widths: new Array(21).fill('4%'),
                    body: tableBody
                },
                layout: "centerPGR",
            };

            console.log("Finalizando construção dos requisitos.");
            return {
                stack: [
                    createTitle(),
                    tableDefinition
                ]
            };

        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
        }
    }
};
