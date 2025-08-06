const { getAllGesByServico, getOneGesService, getEpisInString } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");
const { text } = require("body-parser");

module.exports = {
    buildIntroducao: async (empresa, reportConfig, servicoId, gesIds) => {
        try {
            const createHeaderRow = () => [
                {
                    text: "GES",
                    fontSize: 8,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 8, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Item  31.3.3.2.1\na) Caracterização dos Processos",
                    fontSize: 8,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Item  31.3.3.2.1\na) Caracterização dos Ambientes de Trabalho",
                    fontSize: 8,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 0, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Responsável",
                    fontSize: 8,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 8, 0, 0],
                    lineHeight: 1,
                },
            ];

            const createTitle = () => ({
                text: "INTRODUÇÃO",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 8, 0, 8],
            });

            if (!empresa?.dataValues?.id || !Array.isArray(gesIds) || !reportConfig?.noImageUrl) {
                throw new Error("Parâmetros inválidos fornecidos para gerar a introdução.");
            }

            const gesDataArray = await Promise.all(
                gesIds.map((gesId) => getOneGesService(empresa.dataValues.id, gesId))
            );

            const tableBody = [];

            // Adiciona apenas uma vez o cabeçalho verde
            tableBody.push(createHeaderRow());

            gesDataArray.sort((a, b) =>
                String(a.dataValues.codigo).localeCompare(String(b.dataValues.codigo), 'pt-BR', { numeric: true, sensitivity: 'base' })
            );

            for (const gesResponse of gesDataArray) {
                const ges = gesResponse?.dataValues;
                if (!ges) continue;

                let imagem = null;
                let erroImagemBase = null;
                let erroFluxograma = null;

                const nomeFluxograma = ges.nome_fluxograma || "";
                if (nomeFluxograma) {
                    try {
                        const urlImage = await getFileToS3(nomeFluxograma);
                        const imageData = await getImageData(urlImage.url);
                        if (imageData?.type === "webp") {
                            imageData.data = await convertToPng(imageData.data, 250);
                        }
                        imagem = imageData;
                    } catch (err) {
                        erroFluxograma = `[Fluxograma] Erro ao carregar imagem: ${err.message}`;
                        imagem = null;
                    }
                }

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
                        return "• Equipamentos: Erro ao carregar EPIs\n";
                    }
                };

                const ambiente = ges.ambientesTrabalhos?.ambientesTrabalhos[0]?.dataValues || {};
                const episText = await getEpisObrigatorios(ambiente.EquipamentoAmbienteTrabalho);

                function capitalizeFirst(str) {
                    if (!str) return '';
                    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                }

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
                    if (ambiente.informacoes_adicionais) info.push({ text: `• Informações Adicionais: ${capitalizeFirst(ambiente.informacoes_adicionais)}\n` });

                    return info;
                };

                // Adiciona a linha de dados do GES
                tableBody.push([
                    { text: `${ges.codigo} - ${ges.descricao_ges}` || "", fontSize: 8, alignment: "center", lineHeight: 1 },
                    {
                        text: ges.texto_caracterizacao_processos || "",
                        fontSize: 8,
                        alignment: "center",
                        margin: [5, 0, 5, 0],
                        lineHeight: 1,
                    },
                    {
                        text: createAmbienteInfo(ambiente, episText),
                        fontSize: 8,
                        alignment: "justify",
                        margin: [5, 0, 5, 0],
                        lineHeight: 1,
                    },
                    {
                        text: ges.responsavel || "",
                        fontSize: 8,
                        alignment: "center",
                        margin: [5, 0, 5, 0],
                        lineHeight: 1,
                    },
                ]);

                if (imagem?.data) {

                    tableBody.push([
                        {
                            text: "FLUXOGRAMA",
                            fontSize: 8,
                            alignment: "center",
                            colSpan: 4,
                            lineHeight: 1,
                            fillColor: "#D9D9D9",
                            bold: true,
                        },
                        {}, {}, {}
                    ])

                    tableBody.push([
                        {
                            image: imagem.data,
                            width: 250,
                            alignment: "center",
                            colSpan: 4,
                            margin: [0, 8, 0, 8],
                        },
                        {}, {}, {}
                    ]);
                }
            }

            return [{
                stack: [
                    createTitle(),
                    {
                        table: {
                            widths: ["8%", "30%", "30%", "*"],
                            body: tableBody,
                        },
                        layout: "centerPGR",
                    },
                ]
            }];

        } catch (error) {
            console.error("Erro ao montar introdução do relatório:", error.message);
            return [
                {
                    table: {
                        body: [
                            [
                                {
                                    text: `Erro ao carregar os dados: ${error.message}`,
                                    fontSize: 8,
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
