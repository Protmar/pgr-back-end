const { getAllGesByServico, getCursosInString, getEpisInString, getRacsInString, getOneGesService, getOneCor } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");
const { getDadosServicosByEmpresaCliente } = require("../../services/servicos");

module.exports = {
    buildPlanoAcao: async (reportConfig, empresa, servicoId, gesIds, cliente) => {
        try {
            const createTitle = () => ({
                text: "PLANO DE AÇÃO (item 1.5.5.2 da NR-01)",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 10]
            });

            const tableBody2 = [];
            const tableBody3 = [];

            const gesData = await Promise.all(
                gesIds.map(async (gesId) => {
                    const response = await getOneGesService(empresa.id, gesId, cliente.dataValues.id);
                    if (!response?.dataValues) {
                        console.warn(`Dados do GES ${gesId} não encontrados`);
                        return null;
                    }
                    return response;
                })
            );

            const servicoData = await getDadosServicosByEmpresaCliente(empresa.id) || [];
            const dataInicioServicoFormatada = servicoData[0]?.dataValues?.data_inicio
                ? new Date(servicoData[0].dataValues.data_inicio).toLocaleDateString("pt-BR")
                : "00/00/0000";

            let item = 0;

            for (const ges of gesData.filter(Boolean)) {
                const riscos = ges.dataValues?.riscos?.riscos || [];
                for (const risco of riscos) {
                    const fator = risco?.fatorRisco?.dataValues;
                    if (!fator?.pgr) continue;

                    item++;

                    const medidasColetivasNec = (risco.planosAcao || []).flatMap(plano =>
                        plano.riscosColetivosNecessaria?.map(m => m?.dataValues?.medidas_coletivas_n).filter(Boolean)
                    ).filter(Boolean).join("; ");

                    const medidasAdministrativasNec = (risco.planosAcao || []).flatMap(plano =>
                        plano.riscosAdministrativosNecessaria?.map(m => m?.dataValues?.medidas_admin).filter(Boolean)
                    ).filter(Boolean).join("; ");

                    const medidasIndividuaisNec = (risco.planosAcao || []).flatMap(plano =>
                        plano.riscosIndividuaisNecessaria?.map(m => m?.dataValues?.medidas_individua).filter(Boolean)
                    ).filter(Boolean).join("; ");

                    for (const plano of risco.planosAcao || []) {
                        const dataPlanoAcaoPrevista = plano.dataValues.data_prevista ? new Date(plano.dataValues.data_prevista) : null;
                        const dataPlanoAcaoExecutada = plano.dataValues.data_realizada ? new Date(plano.dataValues.data_realizada) : null;

                        let status = "";
                        if (dataPlanoAcaoExecutada && Date.now() >= dataPlanoAcaoExecutada.getTime()) {
                            status = "Executado";
                        } else if (dataPlanoAcaoPrevista && Date.now() > dataPlanoAcaoPrevista.getTime()) {
                            status = "Atrasado";
                        } else if (dataPlanoAcaoPrevista) {
                            status = "Andamento";
                        }

                        const fillColor = status === "Andamento" ? "#ffec00" :
                            status === "Atrasado" ? "#ff0000" :
                                status === "Executado" ? "#32CD32" : "#D3D3D3";

                        tableBody2.push([
                            { text: item, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: dataInicioServicoFormatada, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: ges.dataValues.codigo || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: ges.dataValues.descricao_ges || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: fator.tipo?.[0] || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: fator.descricao || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: risco.fonteGeradora?.dataValues?.descricao || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: "", fontSize: 8, alignment: "center", lineHeight: 1 },
                        ]);

                        tableBody3.push([
                            {
                                text: [
                                    medidasColetivasNec ? { text: `• Coletiva: `, bold: true } : null,
                                    medidasColetivasNec ? medidasColetivasNec + "\n" : null,
                                    medidasAdministrativasNec ? { text: `• Administrativa: `, bold: true } : null,
                                    medidasAdministrativasNec ? medidasAdministrativasNec + "\n" : null,
                                    medidasIndividuaisNec ? { text: `• Individual: `, bold: true } : null,
                                    medidasIndividuaisNec ? medidasIndividuaisNec : null,
                                ].filter(Boolean),
                                colSpan: 2,
                                fontSize: 8,
                                alignment: "justify", lineHeight: 1
                            }, {},
                            { text: plano.dataValues.responsavel || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: dataPlanoAcaoPrevista ? dataPlanoAcaoPrevista.toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: dataPlanoAcaoExecutada ? dataPlanoAcaoExecutada.toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: plano.dataValues.resultado || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: status, fontSize: 8, alignment: "center", lineHeight: 1, fillColor, color: "white"},
                            { text: plano.dataValues.data_inspecao ? new Date(plano.dataValues.data_inspecao).toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: plano.dataValues.data_monitoramento ? new Date(plano.dataValues.data_monitoramento).toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1 },
                        ]);
                    }
                }
            }

            const tabelaCabecalhoVerde = {
                table: {
                    widths: new Array(9).fill("11.11%"),
                    body: [
                        [
                            "Item", "Data Registro", "GES", "Descrição GES", "Agente de Risco",
                            "Fator de Risco", "Fonte Geradora", "Prioridade", "Eliminação do Risco"
                        ].map(h => ({
                            text: h,
                            fontSize: 8,
                            bold: true,
                            alignment: "center",
                            fillColor: "#2f945d",
                            color: "white",
                            lineHeight: 1
                        })),
                        ...tableBody2,
                    ]
                },
                layout: "centerPGR"
            };

            const tabelaCabecalhoCinza = {
                table: {
                    widths: new Array(9).fill("11.11%"),
                    body: [
                        [
                            { text: "Medidas de Controle Necessárias", colSpan: 2, fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 }, {},
                            { text: "Responsável", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                            { text: "Data Prevista", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                            { text: "Data Executada", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                            { text: "Resultado", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                            { text: "Status", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                            { text: "Data Inspeção", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                            { text: "Data Monitoramento", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 }
                        ],
                        ...tableBody3
                    ],
                    
                },
                layout: "centerPGR4"
            };




            return {
                stack: [
                    createTitle(),
                    tabelaCabecalhoVerde,
                    tabelaCabecalhoCinza
                ]
            };

        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
            throw error;
        }
    }
};
