const { getAllGesByServico, getCursosInString, getEpisInString, getRacsInString, getOneGesService } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

module.exports = {
    buildInventarioRiscos: async (reportConfig, empresa, servicoId, gesIds, cliente) => {
        try {

            const createTitle = () => {
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
            const tableBody2 = [];

            tableBody.push(
                [
                    {
                        text: "Identificação de Perigos (Item 1.5.4.3 da NR-01)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#000000",
                        color: "white",
                        margin: [0, 5, 0, 0],
                        lineHeight: 1,
                        colSpan: 15
                    },
                    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
                    {
                        text: "Classificação dos Riscos Ocupacionais (Item 1.5.4.4.5 da NR-01)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#000000",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 6
                    },
                    {}, {}, {}, {}, {}
                ],
                [
                    {
                        text: "Item 1.5.4.3.1 da NR-01",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#2f945d",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 8
                    },
                    {}, {}, {}, {}, {}, {}, {},
                    {
                        text: "Item 1.5.4.4.4 da NR-01 (critérios de PROBABILIDADE)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#2f945d",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 7
                    },
                    {}, {}, {}, {}, {}, {},
                    {
                        text: "Item 1.5.4.4.2 da NR-01 (Nível de Risco Ocupacional)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#2f945d",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 6
                    },
                    {}, {}, {}, {}, {}
                ],
            );

            tableBody2.push(
                [
                    { text: "Nº GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Descrição GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "AGENTE DE RISCO", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Fator de Risco (eSocial)/Descrição dos Perigos", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Possíveis Lesões ou Agravos à Saúde", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Código eSocial", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Transmitir e-Social", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "FONTE GERADORA OU CIRCUNSTÂNCIA", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Exposição Meio de Propagação / Trajetória", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Intens. / Conc.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "LT / LE", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Técnica Utilizada", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Exigências da atividade de trabalho", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Item NR", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Medidas de Prevenção Implementadas", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Prob.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Sev.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Grau de Risco", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Classe de Risco", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Medidas de Controle Necessárias", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    { text: "Observação", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                ]
            )

            const gesData = await Promise.all(
                gesIds.map(async (gesId) => {
                    console.log("EMPRESA", empresa.id);
                    const response = await getOneGesService(empresa.id, gesId, cliente.dataValues.id);
                    if (!response?.dataValues) {
                        console.warn(`Dados do GES ${gesId} não encontrados`);
                        return null;
                    }

                    return response

                })
            )

            gesData.map(async (ges) => {
                ges.dataValues.riscos.riscos.map(async (risco) => {
                    tableBody2.push(
                        [
                            { text: ges.dataValues.id, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: ges.dataValues.descricao_ges, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.fatorRisco.dataValues.tipo, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.fatorRisco.dataValues.descricao, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.fatorRisco.dataValues.danos_saude, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.fatorRisco.dataValues.codigo_esocial, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.transmitir_esocial, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.fatorRisco.dataValues.descricao, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: "???", fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.intens_conc, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.lt_le, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.tecnicaUtilizada.dataValues.descricao, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: "???", fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: "???", fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: "???", fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.probab_freq, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.conseq_severidade, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.grau_risco, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.classe_risco, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: "???", fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                            { text: risco.obs, fontSize: 8, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 1 },
                        ])
                })
            })

            const tableDefinition = {
                table: {
                    widths: new Array(21).fill('4.76%'),
                    body: tableBody
                },
                layout: {
                    hLineColor: () => "#D3D3D3",
                    vLineColor: () => "#D3D3D3",
                }
            };

            const tableDefinition2 = {
                table: {
                    widths: new Array(21).fill('4.76%'),
                    body: tableBody2
                },
                layout: "centerPGR",

                // layout: {
                //     hLineColor: () => "#D3D3D3",
                //     vLineColor: () => "#D3D3D3",
                // }
            };

            console.log("Finalizando construção dos requisitos.");
            return {
                stack: [
                    createTitle(),
                    tableDefinition,
                    tableDefinition2
                ]
            };

        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
        }
    }
};
