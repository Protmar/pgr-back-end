const { getAllGesByServico, getOneGesService, getEpisInString } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

module.exports = {
    buildIntroducao: async (empresa, reportConfig, servicoId, gesIds) => {
        try {
            const createHeaderRow = () => [
                {
                    text: "GES",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 12, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Item  31.3.3.2.1\na) Caracterização dos Processos",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Item  31.3.3.2.1\na) Caracterização dos Ambientes de Trabalho",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 0, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Responsável",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 12, 0, 0],
                    lineHeight: 1,
                },
            ];

            const createTitle = () => ({
                text: "INTRODUÇÃO",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 10],
            });

            if (!empresa?.dataValues?.id || !Array.isArray(gesIds) || !reportConfig?.noImageUrl) {
                throw new Error("Parâmetros inválidos fornecidos para gerar a introdução.");
            }

            const gesDataArray = await Promise.all(
                gesIds.map((gesId) => getOneGesService(empresa.dataValues.id, gesId))
            );

            const tables = await Promise.all(
                gesDataArray.map(async (gesResponse, index) => {
                    const ges = gesResponse?.dataValues;
                    if (!ges) throw new Error(`Dados do GES não encontrados para o ID: ${gesIds[index]}`);

                    let imagemBase;
                    try {
                        imagemBase = await getImageData(reportConfig.noImageUrl);
                    } catch (e) {
                        throw new Error("Erro ao carregar imagem base: " + e.message);
                    }

                    let imagem = null;
                    const nomeFluxograma = ges.nome_fluxograma || null;

                    if (nomeFluxograma) {
                        try {
                            if (typeof nomeFluxograma !== "string" || nomeFluxograma.trim() === "") {
                                throw new Error("Nome do fluxograma inválido");
                            }

                            const urlImage = await getFileToS3(nomeFluxograma);

                            if (!urlImage?.url || typeof urlImage.url !== "string" || !urlImage.url.startsWith("http")) {
                                throw new Error(`URL inválida do fluxograma: ${JSON.stringify(urlImage)}`);
                            }

                            imagem = await getImageData(urlImage.url);

                            if (imagem?.type === "webp") {
                                imagem.data = await convertToPng(imagem.data, 250);
                            }
                        } catch (err) {
                            console.error(`[Fluxograma] Erro ao carregar imagem do GES ${ges.id} (${nomeFluxograma}): ${err.message}`);
                            imagem = null;
                        }
                    }

                    const imageData = nomeFluxograma && imagem
                        ? [
                            {
                                image: imagem.data || imagemBase.data,
                                width: 250,
                                alignment: "center",
                                colSpan: 4,
                            },
                            {}, {}, {}
                        ]
                        : [];

                    const getEpisObrigatorios = async (epis) => {
                        if (!Array.isArray(epis) || epis.length === 0) return "";
                        try {
                            const epiStrings = await Promise.all(
                                epis.map(async (epi) => {
                                    if (!epi?.equipamento?.id) return "";
                                    return await getEpisInString(epi.equipamento.id);
                                })
                            );
                            return `• Equipamentos: ${epiStrings.filter(Boolean).join("; ")}\n`;
                        } catch (err) {
                            console.error("Erro ao carregar EPIs:", err.message);
                            return "• Equipamentos: Erro ao carregar EPIs\n";
                        }
                    };

                    const ambiente = ges.ambientesTrabalhos?.ambientesTrabalhos[0]?.dataValues || {};
                    const episText = await getEpisObrigatorios(ambiente.EquipamentoAmbienteTrabalho);

                    const createAmbienteInfo = (ambiente, episText) => {
                        const info = [];
                        if (ambiente.area) info.push({ text: `• Área: ${ambiente.area}\n` });
                        if (ambiente.pe_direito) info.push({ text: `• Pé Direito: ${ambiente.pe_direito}\n` });
                        if (ambiente.qnt_janelas) info.push({ text: `• Qtd. Janelas: ${ambiente.qnt_janelas}\n` });
                        if (ambiente.EquipamentoAmbienteTrabalho?.length) {
                            info.push({ text: `• Qtd. Equipamentos: ${ambiente.EquipamentoAmbienteTrabalho.length}\n` });
                        }
                        if (episText) info.push({ text: episText });
                        if (ambiente.teto?.descricao) info.push({ text: `• Teto: ${ambiente.teto.descricao}\n` });
                        if (ambiente.edificacao?.descricao) info.push({ text: `• Edificação: ${ambiente.edificacao.descricao}\n` });
                        if (ambiente.piso?.descricao) info.push({ text: `• Piso: ${ambiente.piso.descricao}\n` });
                        if (ambiente.parede?.descricao) info.push({ text: `• Parede: ${ambiente.parede.descricao}\n` });
                        if (ambiente.ventilacao?.descricao) info.push({ text: `• Ventilação: ${ambiente.ventilacao.descricao}\n` });
                        if (ambiente.iluminacao?.descricao) info.push({ text: `• Iluminação: ${ambiente.iluminacao.descricao}\n` });
                        if (ambiente.informacoes_adicionais) info.push({ text: `• Informações Adicionais: ${ambiente.informacoes_adicionais}\n` });

                        return info;
                    };

                    const tableBody = [
                        createHeaderRow(),
                        [
                            { text: `${ges.codigo} - ${ges.descricao_ges}` || "", fontSize: 10, alignment: "center", lineHeight: 1 },
                            {
                                text: ges.texto_caracterizacao_processos || "",
                                fontSize: 10,
                                alignment: "center",
                                margin: [5, 0, 5, 0],
                                lineHeight: 1,
                            },
                            {
                                text: createAmbienteInfo(ambiente, episText),
                                fontSize: 10,
                                alignment: "justify",
                                margin: [5, 0, 5, 0],
                                lineHeight: 1,
                            },
                            {
                                text: ges.responsavel || "",
                                fontSize: 10,
                                alignment: "center",
                                margin: [5, 0, 5, 0],
                                lineHeight: 1,
                            },
                        ],
                    ];

                    if (nomeFluxograma && imagem) {
                        tableBody.push([
                            {
                                text: "Fluxograma",
                                fontSize: 12,
                                alignment: "center",
                                colSpan: 4,
                                margin: [0, 10, 0, 0],
                                fillColor: "#f0f0f0",
                                pageBreak: "before",
                            },
                            {}, {}, {}
                        ]);
                        tableBody.push(imageData);
                    }

                    const stack = [
                        createTitle(),
                        {
                            table: {
                                widths: ["10%", "30%", "30%", "*"],
                                body: tableBody,
                            },
                            layout: "centerPGR",
                        },
                    ];

                    return {
                        stack,
                        pageBreak: index < gesDataArray.length - 1 ? "after" : undefined,
                    };
                })
            );

            return tables;
        } catch (error) {
            console.error("Erro ao montar introdução do relatório:", error.message);
            return [
                {
                    table: {
                        body: [
                            [
                                {
                                    text: `Erro ao carregar os dados: ${error.message}`,
                                    fontSize: 12,
                                    color: "red",
                                    alignment: "center",
                                    colSpan: 4,
                                },
                                {}, {}, {}
                            ],
                        ],
                    },
                },
            ];
        }
    },
};
