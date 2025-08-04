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
            const dataInicioServicoFormatada = servicoData && servicoData[0]?.dataValues?.data_inicio
                ? new Date(servicoData[0].dataValues.data_inicio).toLocaleDateString("pt-BR")
                : "";

            let item = 0;

            const gesOrdenados = gesData && gesData.sort((a, b) => {
                const descA = a.dataValues.codigo.toLowerCase(); // Para ignorar maiúsculas/minúsculas
                const descB = b.dataValues.codigo.toLowerCase();

                if (descA < descB) return -1;
                if (descA > descB) return 1;
                return 0;
            });

            for (const ges of gesOrdenados) {

                const riscos = ges.dataValues?.riscos?.riscos || [];
                for (const risco of riscos) {

                    if (!risco.planosAcao) {
                        console.warn(`Risco ${risco.id} não possui planos de ação`);
                        continue;
                    }

                    const fator = risco?.fatorRisco?.dataValues;
                    const planoAcao = risco?.planosAcao[0]?.dataValues;
                    if (!fator?.pgr) continue;

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

                        item++;

                        const dataPlanoAcaoPrevista = plano.dataValues.data_prevista ? new Date(plano.dataValues.data_prevista) : null;
                        const dataPlanoAcaoExecutada = plano.dataValues.data_realizada ? new Date(plano.dataValues.data_realizada) : null;

                        let status = "";

                        if (dataPlanoAcaoPrevista && dataPlanoAcaoExecutada) {
                            if (dataPlanoAcaoExecutada && Date.now() >= dataPlanoAcaoExecutada.getTime()) {
                                status = "Executado";
                            } else if (dataPlanoAcaoPrevista && Date.now() > dataPlanoAcaoPrevista.getTime()) {
                                status = "Atrasado";
                            } else if (dataPlanoAcaoPrevista) {
                                status = "Andamento";
                            }
                        }

                        const fillColor = status === "Andamento" ? "#00B0F0" :
                            status === "Atrasado" ? "#FF0000" :
                                status === "Executado" ? "#92D050" : "#ffffff";

                        tableBody2.push(
                            [
                                { text: "Item", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: "Data Registro", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: "GES", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: "Descrição GES", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: "Agente de Risco", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: "Fator de Risco", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: "Fonte Geradora", fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", margin: [0, 3, 0, 0] },
                                { text: `Prioridade (alínea "e" item 1.5.3.2)`, fontSize: 8, alignment: "center", lineHeight: 1, fillColor: "#2f945d", color: "white", },
                            ],
                            [
                                { text: item || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: dataInicioServicoFormatada || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: ges.dataValues.codigo || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: ges.dataValues.descricao_ges || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: fator.tipo?.[0] || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: fator.descricao || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: risco.fonteGeradora?.dataValues?.descricao || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                                { text: risco.classe_risco || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["14.4%", "14.4%", "14.4%", "7%", "7%", "14.4%", "14.4%", "7%", "7%"],
                                        body: [
                                            [
                                                { text: "Medidas de Controle Necessárias", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, colSpan: 2, margin: [0, 15, 0, 0] },
                                                {},
                                                { text: "Responsável", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, margin: [0, 15, 0, 0] },
                                                { text: "Data Prevista Implementação (Item 1.5.5.3.1 da NR-01)", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1 },
                                                { text: "Data Executada (alínea a item 1.5.5.3.2)", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, margin: [0, 5, 0, 0] },
                                                { text: "Resultado", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, margin: [0, 15, 0, 0] },
                                                { text: "Status", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, margin: [0, 15, 0, 0] },
                                                { text: "Data Inspeção (alínea b item 1.5.5.3.2)", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, margin: [0, 5, 0, 0] },
                                                { text: "Data Monitoramento (alínea c item 1.5.5.3.2)", fontSize: 8, bold: true, alignment: "center", fillColor: "#f2f2f2", lineHeight: 1, margin: [0, 5, 0, 0] }
                                            ],
                                            [
                                                {
                                                    text: [
                                                        planoAcao.eliminar_risco_coletivo === "N/A" ? { text: `• Coletiva: `, bold: true } : planoAcao.eliminar_risco_coletivo === "Sim" ?  null : medidasColetivasNec && { text: `• Coletiva: `, bold: true },
                                                        planoAcao.eliminar_risco_coletivo === "N/A" ? "N/A" + "\n" : planoAcao.eliminar_risco_coletivo === "Sim" ? null : medidasColetivasNec && medidasColetivasNec + "\n" ,
                                                        planoAcao.eliminar_risco_administrativo === "N/A" ? { text: `• Administrativa: `, bold: true } : planoAcao.eliminar_risco_administrativo === "Sim" ? null : medidasAdministrativasNec && { text: `• Administrativa: `, bold: true },
                                                        planoAcao.eliminar_risco_administrativo === "N/A" ? "N/A" + "\n" : planoAcao.eliminar_risco_administrativo === "Sim" ? null : medidasAdministrativasNec && medidasAdministrativasNec + "\n",
                                                        planoAcao.eliminar_risco_individual === "N/A" ? { text: `• individual: `, bold: true } : planoAcao.eliminar_risco_individual === "Sim" ? null : medidasIndividuaisNec && { text: `• individual: `, bold: true },
                                                        planoAcao.eliminar_risco_individual === "N/A" ? "N/A" + "\n" : planoAcao.eliminar_risco_individual === "Sim" ? null : medidasIndividuaisNec && medidasIndividuaisNec + "\n",
                                                    ],
                                                    fontSize: 8,
                                                    alignment: "justify", lineHeight: 1,
                                                    margin: [5, 0, 5, 0],
                                                    colSpan: 2
                                                },
                                                {},
                                                { text: plano.dataValues.responsavel || "", fontSize: 8, alignment: "center", lineHeight: 1, margin: [5, 0, 5, 0] },
                                                { text: dataPlanoAcaoPrevista ? dataPlanoAcaoPrevista.toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1, margin: [5, 0, 5, 0] },
                                                { text: dataPlanoAcaoExecutada ? dataPlanoAcaoExecutada.toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1, margin: [5, 0, 5, 0] },
                                                { text: plano.dataValues.resultado_realizacacao || "", fontSize: 8, alignment: "center", lineHeight: 1, margin: [5, 0, 5, 0] },
                                                { text: status, fontSize: 8, alignment: "center", lineHeight: 1, fillColor, color: "white", margin: [5, 0, 5, 0] },
                                                { text: plano.dataValues.data_inspecao ? new Date(plano.dataValues.data_inspecao).toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1, margin: [5, 0, 5, 0] },
                                                { text: plano.dataValues.data_monitoramento ? new Date(plano.dataValues.data_monitoramento).toLocaleDateString("pt-BR") : "", fontSize: 8, alignment: "center", lineHeight: 1, margin: [5, 0, 5, 0] },
                                            ]
                                        ]
                                    },
                                    colSpan: 8,
                                    layout: {
                                        hLineColor: () => "#D3D3D3",
                                        vLineColor: (i, node) => {
                                            // Apenas extremidades verticais pretas
                                            const isFirst = i === 0;
                                            return isFirst ? '#000000' : '#D3D3D3'; // internas cinza claro
                                        },
                                        hLineWidth: () => 0.5,
                                        vLineWidth: () => 0.5,
                                    },
                                    margin: [-0.5, -2, 0, -2]
                                }, {}, {}, {}, {}, {}, {}, {}
                            ]
                        );

                    }
                }
            }

            const legenda = () => ({
                table: {
                    widths: ["10%", "10%", "10%"],
                    body: [
                        [
                            {
                                text: 'QUADRO AFERIÇÃO DAS AÇÕES',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                colSpan: 3,
                                fillColor: "#f2f2f2"
                            }, {}, {}
                        ],
                        [
                            {
                                text: 'EXECUTADA',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#92D050",
                            },
                            {
                                text: '0%',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#92D050",
                            },
                            {
                                text: '0',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#92D050",
                            }
                        ],
                        [
                            {
                                text: 'ATRASADA',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#FF0000",
                            },
                            {
                                text: '0%',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#FF0000",
                            },
                            {
                                text: '0',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#FF0000",
                            }
                        ],
                        [
                            {
                                text: 'ANDAMENTO',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#00B0F0",
                            },
                            {
                                text: '100%',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#00B0F0",
                            },
                            {
                                text: '303',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#00B0F0",
                            }
                        ],
                        [
                            {
                                text: 'SEM DATA',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#FF9999",
                            },
                            {
                                text: '0%',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#FF9999",
                            },
                            {
                                text: '0',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                                fillColor: "#FF9999",
                            }
                        ],
                        [
                            {
                                text: 'TOTAL',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                            },
                            {
                                text: '100%',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                            },
                            {
                                text: '303',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1,
                                alignment: 'center',
                            }
                        ]
                    ]
                },
                layout: {
                    hLineColor: () => "#D3D3D3",
                    vLineColor: (i, node) => {
                        // Apenas extremidades verticais pretas
                        const isFirst = i === 0;
                        return isFirst ? '#000000' : '#D3D3D3'; // internas cinza claro
                    },
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                },
            })

            if (tableBody2.length === 0) {
                console.warn("Nenhum plano de ação encontrado. Nada será retornado.");
                return null;
            }

            return {
                stack: [
                    createTitle(),
                    {
                        table: {
                            widths: new Array(8).fill("12.5%"),
                            body: [
                                ...tableBody2,
                            ]
                        },
                        layout: "centerPGR4"
                    },
                    legenda()
                ]
            };

        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
            throw error;
        }
    }
};
