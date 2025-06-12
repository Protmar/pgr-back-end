const { getAllGesByServico, getCursosInString, getEpisInString, getRacsInString, getOneGesService, getOneCor } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");
const { table } = require("console");
const { col } = require("sequelize");
const { getDadosServicosByEmpresaCliente } = require("../../services/servicos");

module.exports = {
    buildPlanoAcao: async (reportConfig, empresa, servicoId, gesIds, cliente) => {
        try {

            const createTitle = () => {
                return {
                    text: "PLANO DE AÇÃO (item 1.5.5.2 da NR-01)",
                    fontSize: 18,
                    bold: true,
                    alignment: "center",
                    margin: [0, 10, 0, 10]
                };
            };
            const tableBody2 = [];

            const gesData = await Promise.all(
                gesIds.map(async (gesId) => {
                    const response = await getOneGesService(empresa.id, gesId, cliente.dataValues.id);
                    if (!response?.dataValues) {
                        console.warn(`Dados do GES ${gesId} não encontrados`);
                        return null;
                    }

                    return response

                })
            )

            const servicoData = await getDadosServicosByEmpresaCliente(empresa.id) || [];

            const converterData = (dataISO) => {
                const [ano, mes, dia] = dataISO.split("-");
                return `${dia}/${mes}/${ano}`;
            }

            const dataInicioServicoOriginal = servicoData ? servicoData[0].dataValues.data_inicio : null;
            const dataInicioServicoFormatada = servicoData ? converterData(servicoData[0].dataValues.data_inicio) : null;

            let item = 0;

            gesData.map(async (ges) => {

                ges.dataValues.riscos.riscos.map(async (risco) => {

                    item++;

                    if (risco?.dataValues.fatorRisco.dataValues?.pgr !== true) {
                        return
                    }

                    const medidasColetivasNec = (risco.dataValues.planosAcao?.flatMap(plano =>
                        plano.dataValues.riscosColetivosNecessaria?.flatMap(m => m.dataValues.medidas_coletivas_n || [])
                    ) || []).filter(Boolean).join("; ");

                    const medidasAdministrativasNec = (risco.dataValues.planosAcao?.flatMap(plano =>
                        plano.dataValues.riscosAdministrativosNecessaria?.flatMap(m => m.dataValues.medidas_admin || [])
                    ) || []).filter(Boolean).join("; ");

                    const medidasIndividuaisNec = (risco.dataValues.planosAcao?.flatMap(plano =>
                        plano.dataValues.riscosIndividuaisNecessaria?.flatMap(m => m.dataValues.medidas_individua || [])
                    ) || []).filter(Boolean).join("; ");

                    risco.dataValues.planosAcao?.flatMap(plano => {

                        const dataPlanoAcaoPrevista = new Date(plano.dataValues.data_prevista);
                        const dataPlanoAcaoExecutada = plano.dataValues.data_realizada
                            ? new Date(plano.dataValues.data_realizada)
                            : null;

                        let status = "";

                        if (dataPlanoAcaoExecutada && Date.now() >= dataPlanoAcaoExecutada.getTime()) {
                            status = "Executado";
                        } else if (Date.now() > dataPlanoAcaoPrevista.getTime()) {
                            status = "Atrasado";
                        } else {
                            status = "Andamento";
                        }

                        tableBody2.push(
                            [
                                { text: "Item", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Data Registro", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Descrição GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Agente de Risco", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Fator de Risco", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Fonte Geradora ou Circunstância", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Prioridade", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                                { text: "Eliminação do Risco (Sim/Não)", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                            ],
                            [
                                { text: item, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: dataInicioServicoFormatada || "", fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: ges.dataValues.codigo, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: ges.dataValues.descricao_ges, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: risco.fatorRisco.dataValues.tipo[0], fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: risco.fatorRisco.dataValues.descricao, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: risco.fonteGeradora.dataValues.descricao, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: "???", fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                { text: "???", fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                            ],
                            [
                                { text: "Medidas de Controle Necessárias", margin: [0, 5, 0, 0], colSpan: 2, fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                {},
                                { text: "Responsável", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                { text: "Data Prevista Implementação", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                { text: "Data Conclusão e Verificação", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                { text: "Resultado", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                { text: "Status", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                { text: "Data Inspeção", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },
                                { text: "Data Monitoramento", fontSize: 8, bold: true, alignment: "center", fillColor: "#D9D9D9", color: "black", lineHeight: 1 },

                            ],
                            [
                                {
                                    table: {
                                        widths: new Array(9).fill('11.11%'),
                                        body: [
                                            [
                                                {
                                                    text: [
                                                        medidasColetivasNec ? { text: `• Medida de Controle Coletiva Necessária: `, bold: true } : null,
                                                        medidasColetivasNec ? { text: ` ${medidasColetivasNec}.\n` } : null,

                                                        medidasAdministrativasNec ? { text: `• Medida de Controle Administrativa Necessária: `, bold: true } : null,
                                                        medidasAdministrativasNec ? { text: ` ${medidasAdministrativasNec}.\n` } : null,

                                                        medidasIndividuaisNec ? { text: `• Medida de Controle Individual Necessária: `, bold: true } : null,
                                                        medidasIndividuaisNec ? { text: ` ${medidasIndividuaisNec}.\n` } : null,
                                                    ].filter(Boolean),
                                                    fontSize: 8,
                                                    alignment: "justify",
                                                    margin: [5, 0, 5, 0],
                                                    lineHeight: 1,
                                                    colSpan: 2,
                                                },
                                                {},
                                                {
                                                    text: plano.dataValues.responsavel || "",
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                },
                                                {
                                                    text: "???",
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                },
                                                {
                                                    text: "???",
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                },
                                                {
                                                    text: "???",
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                },
                                                {
                                                    text: status,
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                    fillColor: status == "Andamento" ? "#00BFFF" : status == "Atrasado" ? "#FF4500" : "#32CD32",
                                                },
                                                {
                                                    text: "???",
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                },
                                                {
                                                    text: "???",
                                                    fontSize: 8,
                                                    alignment: "center",
                                                    bold: false,
                                                    lineHeight: 1,
                                                },


                                            ],
                                        ]
                                    },
                                    lineHeight: 1,
                                    margin: [-0.5, -2, -0.5, -2],
                                    colSpan: 9,
                                    layout: {
                                        hLineWidth: () => 0.5,
                                        vLineWidth: () => 0.5,
                                        hLineColor: () => "D3D3D3",
                                        vLineColor: () => "#D3D3D3"
                                    }
                                }, {}, {}, {}, {}, {}, {}, {}, {}


                            ],
                        )

                    })

                })
            })


            const tableDefinition2 = {
                table: {
                    widths: new Array(9).fill('11.11%'),
                    body: tableBody2
                },
                layout: "centerPGR",
                maxWidth: "100%"

            };

            return {
                stack: [
                    createTitle(),
                    tableDefinition2,

                ]
            };

        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
        }
    }
};
