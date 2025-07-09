const { getAllGesByServico } = require("../../services/ges");
const {
    getDadosTrabalhadorService,
    getDadosComumService,
    getNomeCargoService,
    getNomeSetorService,
    getNomeGerenciaService
} = require("../../services/trabalhadores/index");

module.exports = {
    buildGes: async (reportConfig, empresa, servicoId, gesIds) => {
        try {
            const data = await getAllGesByServico(empresa.dataValues.id, servicoId);

            if (!data || !Array.isArray(data)) {
                throw new Error("Dados inválidos retornados do serviço");
            }

            const filteredData = data.filter(item => gesIds.includes(item.id));

            const createHeaderRow = () => [
                {
                    text: "GES", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },
                {
                    text: "Cargo", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },
                {
                    text: "Função", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },
                {
                    text: "Setor", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },
                {
                    text: "Gerência", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },
                {
                    text: "Qtd. Trab. Expostos", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },
                {
                    text: "Jornada (min)", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    lineHeight: 1
                },

            ];

            const createTitle = () => ({
                text: "Grupo de Exposição Similar - GES",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 10]
            });

            const getGesData = async (trabalhadores) => {
                if (!trabalhadores || !Array.isArray(trabalhadores)) {
                    return [];
                }

                const workerPromises = trabalhadores.map(trabalhador =>
                    getDadosTrabalhadorService(
                        empresa.dataValues.id,
                        trabalhador.dataValues.trabalhador.dataValues.id
                    ).catch(err => {
                        console.error(`Erro ao buscar dados do trabalhador ${trabalhador.dataValues.trabalhador.dataValues.id}:`, err);
                        return null;
                    })
                );


                const workersData = (await Promise.all(workerPromises)).filter(Boolean);
                const groupedWorkers = {};

                for (const worker of workersData) {
                    const [cargo, setor, gerencia] = await Promise.all([
                        getNomeCargoService(empresa.dataValues.id, worker.dataValues.cargo_id).catch(() => ({ dataValues: { descricao: "" } })),
                        getNomeSetorService(empresa.dataValues.id, worker.dataValues.setor_id).catch(() => ({ dataValues: { descricao: "" } })),
                        getNomeGerenciaService(empresa.dataValues.id, worker.dataValues.gerencia_id).catch(() => ({ dataValues: { descricao: "" } }))
                    ]);

                    const key = `${cargo.dataValues.descricao}|${setor.dataValues.descricao}|${gerencia.dataValues.descricao}|${worker.dataValues.jornada_trabalho || ""}|${worker.dataValues.funcao.dataValues.descricao || ""}|${worker.dataValues.funcao.dataValues.funcao || ""}`;

                    if (!groupedWorkers[key]) {
                        groupedWorkers[key] = {
                            cargo: cargo.dataValues.descricao,
                            funcao: worker.dataValues.funcao.dataValues.funcao || "",
                            setor: setor.dataValues.descricao,
                            gerencia: gerencia.dataValues.descricao,
                            qtdExpostos: 0,
                            jornada: worker.dataValues.jornada_trabalho || "",
                            descricaoServico: worker.dataValues.funcao.dataValues.descricao || ""
                        };
                    }
                    groupedWorkers[key].qtdExpostos += 1;
                }

                return Object.values(groupedWorkers);
            };

            const tableBody = [];

            for (const item of filteredData) {
                // const ambiente = item.ambientesTrabalhos?.[0] || {};
                const gesData = await getGesData(item.trabalhadores);
                // console.log(item.trabalhadores[0].dataValues.trabalhador.dataValues.funcao.dataValues.descricao);

                if (gesData.length === 0) {
                    tableBody.push([
                        { text: undefined, fontSize: 12, alignment: "center" },
                        { text: undefined, fontSize: 12, alignment: "center" },
                        { text: undefined, fontSize: 12, alignment: "center" },
                        { text: undefined, fontSize: 12, alignment: "center" },
                        { text: undefined, fontSize: 12, alignment: "center" },
                        { text: undefined, fontSize: 12, alignment: "center" },
                        {
                            text: undefined, fontSize: 10,
                            alignment: "center",
                            margin: [5, 0, 5, 0],
                            lineHeight: 1,
                        },

                    ]);
                } else {
                    gesData.forEach((ges) => {
                        tableBody.push([
                            {
                                text: "GES", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },
                            {
                                text: "Cargo", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },
                            {
                                text: "Função", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },
                            {
                                text: "Setor", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },
                            {
                                text: "Gerência", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },
                            {
                                text: "Qtd. Trab. Expostos", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },
                            {
                                text: "Jornada (min)", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                                lineHeight: 1
                            },

                        ]);
                        tableBody.push([
                            {
                                text: `${item.codigo} - ${item.descricao_ges}` || undefined, fontSize: 10, alignment: "center", lineHeight: 1
                            },
                            {
                                text: ges.cargo || undefined, fontSize: 12, alignment: "center", lineHeight: 1
                            },
                            {
                                text: ges.funcao || undefined, fontSize: 12, alignment: "center", lineHeight: 1
                            },
                            {
                                text: ges.setor || undefined, fontSize: 12, alignment: "center", lineHeight: 1
                            },
                            {
                                text: ges.gerencia || undefined, fontSize: 12, alignment: "center", lineHeight: 1
                            },
                            {
                                text: typeof ges.qtdExpostos === 'number' ? String(ges.qtdExpostos) : undefined, fontSize: 12, alignment: "center", lineHeight: 1
                            },
                            {
                                text: ges.jornada ? String(ges.jornada) : undefined, fontSize: 12, alignment: "center", lineHeight: 1
                            },
                        ]);

                        // tableBody.push([
                        //     {
                        //         text: `• Item 1.5.7.3.2 b) Caracterização das Atividades`, fontSize: 12, alignment: "left", lineHeight: 1, colSpan: 8, fillColor: "#f0f0f0"
                        //     }
                        // ]);

                        if (ges.descricaoServico) {
                            tableBody.push([
                                {
                                    text: [
                                        { text: '• Caracterização das Atividades: ', bold: true },
                                        ges.descricaoServico || ''
                                    ],
                                    fontSize: 12,
                                    alignment: "justify",
                                    lineHeight: 1,
                                    colSpan: 7,
                                    margin: [5, 5]
                                }

                            ])
                        }

                        tableBody.push([{
                            text: "", fontSize: 12, bold: true, alignment: "center", color: "white",
                            lineHeight: 5, colSpan: 7
                        }])



                    });
                }
            }

            const tableDefinition = {
                table: {
                    widths: ['14.28%', '14.28%', '14.28%', '14.28%', '14.28%', '14.28%', '14.28%'],
                    body: tableBody
                },
                layout: "centerPGR",
            };

            if (tableBody.length === 1) {
                console.warn("Nenhum plano de ação encontrado. Nada será retornado.");
                return null;
            }

            return {
                stack: [
                    createTitle(),
                    tableDefinition
                ],
                layout: "centerPGR",
            };

        } catch (error) {
            console.error("Erro ao construir GES:", error);
            return [{
                table: {
                    body: [[
                        {
                            text: `Erro ao carregar dados: ${error.message}`,
                            fontSize: 12,
                            color: "red",
                            alignment: "center",
                            colSpan: 7
                        }
                    ]]
                },
            }];
        }
    }
};