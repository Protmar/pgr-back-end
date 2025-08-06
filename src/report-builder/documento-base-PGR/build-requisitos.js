const { getAllGesByServico, getCursosInString, getEpisInString, getRacsInString } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

module.exports = {
    buildRequisitos: async (empresa, reportConfig, servicoId, gesIds) => {
        try {
            const data = await getAllGesByServico(empresa.dataValues.id, servicoId);

            if (!data || !Array.isArray(data)) {
                throw new Error("Dados inválidos retornados do serviço");
            }

            const filteredData = data.filter(item => gesIds.includes(item.id));

            filteredData.sort((a, b) =>
                String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true, sensitivity: 'base' })
            );

            const createHeaderRow = () => [
                {
                    text: "GES", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1
                },
                {
                    text: "Requisitos de Atividade Crítica", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1
                },
                {
                    text: "Cursos de Capacitação Obrigatórios e Requisitos de Atividade Crítica", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    margin: [0, 0, 0, 0],
                    lineHeight: 1
                },
                {
                    text: "Lista de EPIs", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1
                },
                {
                    text: "Observação", fontSize: 8, bold: true, alignment: "center", fillColor: "#2f945d", color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1
                },
            ];

            const createTitle = () => ({
                text: "REQUISITOS",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 10]
            });

            const getCursosObrigatorios = async (cursos) => {
                if (!Array.isArray(cursos) || cursos.length === 0) {
                    return { text: "", fontSize: 8, alignment: "center" };
                }

                try {
                    const cursosStrings = await Promise.all(
                        cursos.map(async (curso) => {
                            try {
                                return curso.curso.dataValues.descricao;
                            } catch (err) {
                                console.error(`Erro ao buscar string do curso ${curso.id}:`, err);
                                return "Curso ";
                            }
                        })
                    );
                    return {
                        text: cursosStrings.join("; ") || "", fontSize: 8,
                        alignment: "center",
                        margin: [5, 0, 5, 0],
                        lineHeight: 1,
                    };
                } catch (err) {
                    return { text: "Erro ao carregar cursos", fontSize: 8, alignment: "center" };
                }
            };

            const getRacs = async (racs) => {
                if (!Array.isArray(racs) || racs.length === 0) {
                    return { text: "", fontSize: 8, alignment: "center" };
                }


                const racstrings = await Promise.all(
                    racs.map(async (epi) => {
                        try {

                            return epi.rac.dataValues.descricao;
                        } catch (err) {
                            console.error(`Erro ao buscar string do RAC:`, err);
                            return "EPI ";
                        }
                    })
                );
                return {
                    text: racstrings.join("; ") || "", fontSize: 8,
                    alignment: "center",
                    margin: [5, 0, 5, 0],
                    lineHeight: 1,
                };

            };

            const tableBody = [createHeaderRow()];

            for (const item of filteredData) {
                const ambiente = item.ambientesTrabalhos?.[0] || {};

                const cursos = await getCursosObrigatorios(item.cursos);
                const racs = await getRacs(item.racs);

                // Coletar todas as medidas individuais de todos os riscos do item
                const medidas = [];

                const riscos = item?.dataValues?.riscos || [];
                for (const risco of riscos) {
                    const medidasIndividuais = risco?.dataValues?.medidas_individuais_existentes || [];
                    for (const medida of medidasIndividuais) {
                        const descricao = medida?.dataValues?.descricao;
                        if (descricao) medidas.push(descricao);
                    }
                }

                // Ordenar e juntar em string separada por ";"
                const medidasTexto = medidas.length > 0
                    ? medidas.sort((a, b) => a.localeCompare(b, 'pt-BR')).join('; ')
                    : '';

                const row = [
                    item.codigo && item.descricao_ges
                        ? { text: `${item.codigo} - ${item.descricao_ges}`, fontSize: 8, alignment: "center", lineHeight: 1 }
                        : { text: undefined },
                    racs?.text ? racs : { text: undefined },
                    cursos?.text ? cursos : { text: undefined },
                    { text: medidasTexto ? medidasTexto + "; " : "", alignment: "center", fontSize: 8, lineHeight: 1 },
                    item.observacao
                        ? {
                            text: item.observacao,
                            fontSize: 8,
                            alignment: "center",
                            margin: [5, 0, 5, 0],
                            lineHeight: 1,
                        }
                        : { text: undefined },
                ];

                tableBody.push(row);
            }



            if (tableBody.length === 1) {
                tableBody.push([
                    { text: "Nenhum dado disponível", colSpan: 5, alignment: "center", fontSize: 8 }
                ]);
            }

            const tableDefinition = {
                table: {
                    widths: ['10%', '25%', '20%', '20%', "25%"],
                    body: tableBody
                },
                layout: "centerPGR",
            };

            return {
                stack: [
                    createTitle(),
                    tableDefinition
                ]
            };

        } catch (error) {
            console.error("Erro ao construir os requisitos:", error);
            return [{
                table: {
                    body: [[
                        {
                            text: `Erro ao carregar dados: ${error.message}`,
                            fontSize: 8,
                            color: "red",
                            alignment: "center",
                            colSpan: 5
                        }
                    ]]
                },

            }];
        }
    }
};