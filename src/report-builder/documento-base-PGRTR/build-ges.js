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

            const createTitle = () => ({
                text: "Grupo de Exposição Similar - GES",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 10]
            });

            const getGesData = async (trabalhadores, codigoGes) => {
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
                            codigoGes: codigoGes || "",
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

                const compare = (x, y) => (x || "").localeCompare(y || "");

                return Object.values(groupedWorkers).sort((a, b) =>
                    compare(a.codigoGes, b.codigoGes) ||
                    compare(a.funcao, b.funcao) ||
                    compare(a.cargo, b.cargo) ||
                    compare(a.setor, b.setor) ||
                    compare(a.gerencia, b.gerencia)
                );
            };

            const tableBody = [];

            for (const item of filteredData) {
                const gesData = await getGesData(item.trabalhadores, item.codigo);

                if (gesData.length === 0) {
                    tableBody.push([
                        { text: undefined, fontSize: 8, alignment: "center" },
                        { text: undefined, fontSize: 8, alignment: "center" },
                        { text: undefined, fontSize: 8, alignment: "center" },
                        { text: undefined, fontSize: 8, alignment: "center" },
                        { text: undefined, fontSize: 8, alignment: "center" },
                        { text: undefined, fontSize: 8, alignment: "center" },
                        { text: undefined, fontSize: 8, alignment: "center", margin: [5, 0, 5, 0], lineHeight: 1 },
                    ]);
                } else {
                    tableBody.push([
                        { text: "GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Cargo", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Função", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Setor", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Gerência", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Qtd. Trab. Expostos", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                        { text: "Jornada (min)", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white", lineHeight: 1 },
                    ]);
                    gesData.forEach((ges) => {
                        // Cabeçalho de cada grupo

                        // Dados
                        tableBody.push([
                            { text: `${item.codigo} - ${item.descricao_ges}` || undefined, fontSize: 10, alignment: "center", lineHeight: 1 },
                            { text: ges.cargo || undefined, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: ges.funcao || undefined, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: ges.setor || undefined, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: ges.gerencia || undefined, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: typeof ges.qtdExpostos === 'number' ? String(ges.qtdExpostos) : undefined, fontSize: 8, alignment: "center", lineHeight: 1 },
                            { text: ges.jornada ? String(ges.jornada) : undefined, fontSize: 8, alignment: "center", lineHeight: 1 },
                        ]);

                        if (ges.descricaoServico) {
                            tableBody.push([{
                                text: [
                                    { text: '• Caracterização das Atividades: ', bold: true },
                                    ges.descricaoServico || ''
                                ],
                                fontSize: 8,
                                alignment: "justify",
                                lineHeight: 1,
                                colSpan: 7,
                                margin: [5, 5]
                            }]);
                        }

                        // tableBody.push([{
                        //     text: "", fontSize: 8, bold: true, alignment: "center", color: "white",
                        //     lineHeight: 5, colSpan: 7
                        // }]);
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
                            fontSize: 8,
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
