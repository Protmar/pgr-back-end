const { getAllGesByServico, getCursosInString, getEpisInString, getRacsInString, getOneGesService, getOneCor } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");
const { table } = require("console");
const { itemNrGetAll2 } = require("../../services/cadastros/fatoresrisco/itemNr/index");
const { CadastroExigenciaAtividade } = require("../../models/ExigenciasAtividades");

module.exports = {
    buildInventarioRiscos: async (reportConfig, empresa, servicoId, gesIds, cliente) => {
        try {
            const createTitle = () => {
                return {
                    text: "Inventário de Riscos",
                    fontSize: 18,
                    bold: true,
                    alignment: "center",
                    margin: [0, 10, 0, 10]
                };
            };

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
                        colSpan: 11
                    },
                    {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
                    {
                        text: "Classificação dos Riscos Ocupacionais (Item 1.5.4.4.5 da NR-01)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#000000",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 4
                    },
                    {}, {}, {}
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
                        colSpan: 7
                    },
                    {}, {}, {}, {}, {}, {},
                    {
                        text: "Item 1.5.4.4.4 da NR-01 (critérios de PROBABILIDADE)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#2f945d",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 4
                    },
                    {}, {}, {},
                    {
                        text: "Item 1.5.4.4.2 da NR-01 (Nível de Risco Ocupacional)",
                        fontSize: 8,
                        bold: true,
                        alignment: "center",
                        fillColor: "#2f945d",
                        color: "white",
                        margin: [0, 0, 0, 0],
                        lineHeight: 1,
                        colSpan: 4
                    },
                    {}, {}, {},
                ],
            );

            // Cabeçalho da tabela de riscos


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

            for (const ges of gesData) {
                if (!ges?.dataValues?.riscos?.riscos) continue;

                for (const risco of ges.dataValues.riscos.riscos) {
                    let exigenciaAtividade = null;
                    if (risco.dataValues.id_exigencia_atividade) {
                        exigenciaAtividade = await CadastroExigenciaAtividade.findOne({
                            where: { id: risco.dataValues.id_exigencia_atividade }
                        });
                        if (exigenciaAtividade) {
                            console.log("AAA", exigenciaAtividade.dataValues.descricao);
                        } else {
                            console.warn(
                                "Exigência da atividade não encontrada para o ID:",
                                risco.dataValues.id_exigencia_atividade
                            );
                        }
                    } else {
                        console.warn("ID de exigência da atividade não definido para risco ID:", risco.dataValues.id);
                    }

                    if (risco?.dataValues.fatorRisco.dataValues?.pgr !== true) {
                        continue;
                    }

                    tableBody2.push([
                        { text: "Nº GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Descrição GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Agente de Risco", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Fator de Risco (eSocial)/Descrição dos Perigos", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Código eSocial", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Transm. E-Social", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "FONTE GERADORA OU CIRCUNSTÂNCIA", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Exposição / Meio de Propagação / Trajetória", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Intens. / Conc.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "LT / LE", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Anotações", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Prob.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Sev.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "G.R.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "C.R.", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    ]);

                    tableBody2.push([
                        { text: ges.dataValues.codigo, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: ges.dataValues.descricao_ges, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.fatorRisco.dataValues.tipo[0], fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.fatorRisco.dataValues.descricao, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.fatorRisco.dataValues.codigo_esocial, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.transmitir_esocial[0], fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.fonteGeradora.dataValues.descricao, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        {
                            text: [
                                { text: "• Exposição: ", bold: true },
                                risco.exposicao.dataValues.descricao,
                                "\n",
                                { text: "• Meio de Propagação: ", bold: true },
                                risco.meioPropagacao.dataValues.descricao,
                                "\n",
                                { text: "• Trajetória: ", bold: true },
                                risco.trajetoria.dataValues.descricao,
                            ],
                            fontSize: 8,
                            alignment: "center",
                            bold: false,
                            lineHeight: 1,
                            colSpan: 1
                        },
                        { text: risco.intens_conc, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.lt_le, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.comentario, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.probab_freq, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.conseq_severidade, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.grau_risco, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                        { text: risco.classe_risco, fontSize: 8, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                    ]);

                    // Adiciona informações adicionais logo após a linha principal
                    const itemNr = await itemNrGetAll2(risco.fatorRisco.dataValues.id);
                    if (risco.fatorRisco.dataValues) {
                        tableBody2.push([
                            {
                                text: [
                                    { text: "• Possíveis Lesões ou Agravos à Saúde: ", bold: true },
                                    risco.fatorRisco.dataValues.danos_saude || ""
                                ],
                                fontSize: 8,
                                alignment: "justify",
                                lineHeight: 1,
                                colSpan: 15,
                                margin: [5, 0, 5, 0],
                            }
                        ]);

                        tableBody2.push([
                            {
                                table: {
                                    widths: ["33%", "33%", "33%"],
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: "• Técnica Utilizada: ", bold: true },
                                                    risco.tecnicaUtilizada.dataValues.descricao
                                                ],
                                                fontSize: 8,
                                                alignment: "justify",
                                                lineHeight: 1,
                                                margin: [5, 0, 5, 0],
                                            },
                                            {
                                                text: [
                                                    { text: "• Exigências da atividade: ", bold: true },
                                                    exigenciaAtividade ? exigenciaAtividade.dataValues.descricao : ""
                                                ],
                                                fontSize: 8,
                                                alignment: "justify",
                                                lineHeight: 1,
                                                margin: [5, 0, 5, 0],
                                            },
                                            {
                                                text: [
                                                    { text: "• Item NR: ", bold: true },
                                                    itemNr.map(item => item.dataValues.item_norma).join("; ") + "; "
                                                ],
                                                fontSize: 8,
                                                alignment: "justify",
                                                lineHeight: 1,
                                                margin: [5, 0, 5, 0],
                                            }
                                        ]
                                    ]
                                },
                                layout: "centerPGR",
                                fontSize: 8,
                                alignment: "justify",
                                lineHeight: 1,
                                colSpan: 15,
                                margin: [-0.5, -2.5, -8.5, -2.5],
                            }
                        ]);
                    }

                    // Medidas de controle existentes
                    const medidasColetivas = risco.relacoes_coletivas?.map(relacao => relacao.dataValues.medidas_coletivas_existentes?.dataValues?.descricao).filter(Boolean).join("; ");
                    const medidasAdministrativas = risco.dataValues.relacoes_administrativas?.map(relacao => relacao.dataValues.medidas_administrativas_existen).filter(Boolean).join("; ");
                    const medidasIndividuais = risco.relacoes_individuais?.map(relacao => relacao.dataValues.medidas_individuais_existentes?.dataValues?.desc).filter(Boolean).join("; ");

                    if (medidasColetivas || medidasAdministrativas || medidasIndividuais) {
                        tableBody2.push([
                            {
                                text: [
                                    medidasColetivas ? { text: `• Medida de Controle Coletiva Existente: `, bold: true } : null,
                                    medidasColetivas ? { text: ` ${medidasColetivas}.\n` } : null,
                                    medidasAdministrativas ? { text: `• Medida de Controle Administrativa Existente: `, bold: true } : null,
                                    medidasAdministrativas ? { text: ` ${medidasAdministrativas}.\n` } : null,
                                    medidasIndividuais ? { text: `• Medida de Controle Individual Existente: `, bold: true } : null,
                                    medidasIndividuais ? { text: ` ${medidasIndividuais}.\n` } : null,
                                ].filter(Boolean),
                                fontSize: 8,
                                alignment: "justify",
                                margin: [5, 0, 5, 0],
                                lineHeight: 1,
                                colSpan: 15
                            },
                        ]);
                    }

                    // Medidas a serem implantadas
                    const medidasColetivasNec = (risco.planosAcao?.flatMap(plano =>
                        plano.dataValues.riscosColetivosNecessaria?.flatMap(m => m.dataValues.medidas_coletivas_n || [])
                    ) || []).filter(Boolean).join("; ");
                    const medidasAdministrativasNec = (risco.planosAcao?.flatMap(plano =>
                        plano.dataValues.riscosAdministrativosNecessaria?.flatMap(m => m.dataValues.medidas_admin || [])
                    ) || []).filter(Boolean).join("; ");
                    const medidasIndividuaisNec = (risco.planosAcao?.flatMap(plano =>
                        plano.dataValues.riscosIndividuaisNecessaria?.flatMap(m => m.dataValues.medidas_individua || [])
                    ) || []).filter(Boolean).join("; ");

                    if (medidasColetivasNec || medidasAdministrativasNec || medidasIndividuaisNec) {
                        tableBody2.push([
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
                                colSpan: 15
                            },
                        ]);
                    }

                    if (risco.obs) {
                        tableBody2.push([
                            {
                                text: [
                                    { text: "• Observação: ", bold: true },
                                    risco.obs
                                ],
                                fontSize: 8,
                                alignment: "justify",
                                lineHeight: 1,
                                colSpan: 15,
                                margin: [5, 0, 5, 0]
                            }
                        ]);
                    }
                }
            }

            if (tableBody2.length === 1) { // Apenas o cabeçalho, sem dados de riscos
                console.warn("Nenhum risco encontrado. Nada será retornado.");
                return null;
            }

            const tableDefinition = {
                table: {
                    widths: ['4.735%', '4.735%', '4.735%', '4.735%', '4.735%', '4.735%', '4.735%', '8.9%', '8.9%', '8.9%', '8.9%', '7.58%', '7.58%', '7.58%', '8.6%'],
                    body: tableBody
                },
                layout: {
                    hLineColor: () => "#D3D3D3",
                    vLineColor: (i, node) => {
                        const isFirst = i === 0;
                        const isLast = i === node.table.widths.length;
                        return isFirst || isLast ? '#000000' : '#D3D3D3';
                    }
                },
                maxWidth: "100%"
            };

            const tableDefinition2 = {
                table: {
                    widths: ['3%', '7.58%', '3%', '7.58%', '3%', '3.6%', '7.58%', '15.14%', '4%', '4%', '11.16%', '7.58%', '7.58%', '7.58%', '7.8%'],
                    body: tableBody2
                },
                layout: "centerPGR",
                maxWidth: "100%"
            };

            const legenda = {
                absolutePosition: { x: 700, y: 105 },
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: 'LEGENDA\n• G.R. = Grau de Risco\n• C.R. = Classe de Risco\n',
                                fontSize: 9,
                                italics: true,
                                color: 'black',
                                lineHeight: 1.3
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                }
            };

            return {
                stack: [
                    createTitle(),
                    legenda,
                    tableDefinition,
                    tableDefinition2,
                ]
            };
        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
        }
    }
};