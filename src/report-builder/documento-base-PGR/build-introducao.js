const { getAllGesByServico, getOneGesService, getEpisInString } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

const getImages = async (images) => {
    if (!Array.isArray(images) || images.length === 0) return [];

    const imagePairs = [];
    for (let i = 0; i < images.length; i += 2) {
        const image1 = images[i];
        const image2 = images[i + 1] || null;
        imagePairs.push([image1, image2]);
    }

    const getDimensions = (originalWidth, originalHeight) => {
        const maxWidth = 230;
        const maxHeight = 150;

        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
            return { width: originalWidth, height: originalHeight };
        }

        const widthRatio = maxWidth / originalWidth;
        const heightRatio = maxHeight / originalHeight;
        const scale = Math.min(widthRatio, heightRatio);

        return {
            width: Math.round(originalWidth * scale),
            height: Math.round(originalHeight * scale),
        };
    };

    const rows = await Promise.all(
        imagePairs.map(async ([img1, img2]) => {
            try {
                if (!img1?.dataValues?.name) throw new Error("Invalid image 1");

                const [file1, file2] = await Promise.all([
                    getFileToS3(img1.dataValues.name),
                    img2?.dataValues?.name ? getFileToS3(img2.dataValues.name) : null,
                ]);

                const [data1, data2] = await Promise.all([
                    getImageData(file1.url),
                    file2 ? getImageData(file2.url) : null,
                ]);

                const dimensions1 = getDimensions(data1.width, data1.height);
                const dimensions2 = data2 ? getDimensions(data2.width, data2.height) : null;

                if (!data2) {
                    // imagem única, centralizada
                    return [
                        {
                            colSpan: 4,
                            stack: [
                                {
                                    image: data1.data,
                                    width: dimensions1.width,
                                    height: dimensions1.height,
                                    alignment: 'center',
                                    margin: [0, 0, 0, 0],
                                },
                            ],
                            margin: [0, 0, 0, 0],
                        }
                    ];
                }

                // duas imagens centralizadas em colunas
                return [
                    {
                        colSpan: 4,
                        columns: [
                            {
                                width: '50%',
                                stack: [
                                    {
                                        image: data1.data,
                                        width: dimensions1.width,
                                        height: dimensions1.height,
                                        alignment: 'center',
                                        margin: [0, 0, 0, 0],
                                    },
                                ],
                            },
                            {
                                width: '50%',
                                stack: [
                                    {
                                        image: data2.data,
                                        width: dimensions2.width,
                                        height: dimensions2.height,
                                        alignment: 'center',
                                        margin: [0, 0, 0, 0],
                                    },
                                ],
                            },
                        ],
                        margin: [0, 0, 0, 0],
                    }
                ];
            } catch (err) {
                console.error("Erro ao processar imagens adicionais:", err.message);
                return [];
            }
        })
    );

    return rows;
};




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
                    text: "Item 1.5.7.3.2\na) Caracterização dos Processos",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    fillColor: "#2f945d",
                    color: "white",
                    margin: [0, 6, 0, 0],
                    lineHeight: 1,
                },
                {
                    text: "Item 1.5.7.3.2\na) Caracterização dos Ambientes de Trabalho",
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

            // Validate inputs
            if (!empresa?.dataValues?.id || !Array.isArray(gesIds) || !reportConfig?.noImageUrl) {
                throw new Error("Invalid input parameters");
            }

            const gesDataArray = await Promise.all(
                gesIds.map((gesId) => getOneGesService(empresa.dataValues.id, gesId))
            );

            const tables = await Promise.all(
                gesDataArray.map(async (gesResponse, index) => {
                    const ges = gesResponse?.dataValues;
                    if (!ges) throw new Error(`GES data not found for ID: ${gesIds[index]}`);

                    const imagemBase = await getImageData(reportConfig.noImageUrl);
                    let imagem = null;
                    const nomeFluxograma = ges.nome_fluxograma || null;

                    if (nomeFluxograma) {
                        try {
                            const urlImage = await getFileToS3(nomeFluxograma);
                            imagem = await getImageData(urlImage.url);

                            if (imagem?.type === "webp") {
                                imagem.data = await convertToPng(imagem.data, 250);
                            }
                        } catch (err) {
                            console.error(`Error processing image for GES ${ges.id}:`, err.message);
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
                            console.error("Error loading EPIs:", err.message);
                            return "• Equipamentos: Error loading EPIs\n";
                        }
                    };

                    const ambiente = ges.ambientesTrabalhos?.ambientesTrabalhos[0].dataValues || {};
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
                        if (ambiente.edificacao?.descricao) {
                            info.push({ text: `• Edificação: ${ambiente.edificacao.descricao}\n` });
                        }
                        if (ambiente.piso?.descricao) info.push({ text: `• Piso: ${ambiente.piso.descricao}\n` });
                        if (ambiente.parede?.descricao) info.push({ text: `• Parede: ${ambiente.parede.descricao}\n` });
                        if (ambiente.ventilacao?.descricao) {
                            info.push({ text: `• Ventilação: ${ambiente.ventilacao.descricao}\n` });
                        }
                        if (ambiente.iluminacao?.descricao) {
                            info.push({ text: `• Iluminação: ${ambiente.iluminacao.descricao}\n` });
                        }
                        if (ambiente.informacoes_adicionais) {
                            info.push({ text: `• Informações Adicionais: ${ambiente.informacoes_adicionais}\n` });
                        }

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
                                alignment: "justfy",
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

                    if (nomeFluxograma) {
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

                    // if (Array.isArray(ges.imagens) && ges.imagens.length) {
                    //     tableBody.push([
                    //         {
                    //             text: "Imagens",
                    //             fontSize: 12,
                    //             alignment: "center",
                    //             colSpan: 4,
                    //             margin: [0, 10, 0, 0],
                    //             fillColor: "#f0f0f0",
                    //             pageBreak: "before",
                    //         },
                    //         {}, {}, {}
                    //     ]);

                    //     const imagensRows = await getImages(ges.imagens);
                    //     if (imagensRows.length > 0) {
                    //         tableBody.push(...imagensRows);
                    //     }
                    // }

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
            console.error("Error building introduction:", error.message);
            return [
                {
                    table: {
                        body: [
                            [
                                {
                                    text: `Error loading data: ${error.message}`,
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