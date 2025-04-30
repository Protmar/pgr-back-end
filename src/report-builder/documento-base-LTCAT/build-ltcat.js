/* eslint-disable @typescript-eslint/no-var-requires */
const moment = require('moment');
const { getDadosServicoByEmpresaServico } = require('../../services/servicos/');
const { getOneResponsavelTecnicoService } = require('../../services/responsavelTecnico/index');
const { getOneGesService } = require('../../services/ges');
const { setorGetService } = require('../../services/cadastros/setor/index');
const { funcaoGetService } = require('../../services/cadastros/funcao/index');
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

moment.locale('pt-BR');

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
                    // imagem única, centraliza na linha inteira
                    return [
                        {
                            colSpan: 2,
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

                // duas imagens na linha, cada uma centralizada em sua metade
                return [
                    {
                        colSpan: 2,
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
                    },
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
    buildLTCAT: async (empresa, servicoId, gesIds, cliente) => {
        const getDataResponsavel = async (empresa, servicoId) => {
            const servicoResponse = await getDadosServicoByEmpresaServico(empresa.id, servicoId);
            const id_responsavel_aprovacao = servicoResponse.dataValues.id_responsavel_aprovacao;
            const response = await getOneResponsavelTecnicoService(empresa.id, id_responsavel_aprovacao, cliente.dataValues.id);
            return response.dataValues;
        };

        const dataResponsavelAprovacao = await getDataResponsavel(empresa, servicoId);
        const dataServico = await getDadosServicoByEmpresaServico(empresa.id, servicoId);

        const dataInicioFormatada = moment(dataServico.dataValues.data_inicio).format('DD/MM/YYYY');
        const dataFimFormatada = moment(dataServico.dataValues.data_fim).format('DD/MM/YYYY');

        const gesData = await Promise.all(
            gesIds.map(async (gesId) => {
                const response = await getOneGesService(empresa.id, gesId, cliente.dataValues.id);
                const trabalhadores = response.dataValues.trabalhadores || [];

                const trabalhadoresComSetorEFuncao = await Promise.all(
                    trabalhadores.map(async (t) => {
                        const trabalhador = t?.dataValues?.trabalhador;
                        let setorDescricao = '';
                        if (trabalhador?.setor_id) {
                            const setor = await setorGetService(empresa.id, trabalhador.setor_id, cliente.dataValues.id);
                            setorDescricao = setor.dataValues.descricao;
                        }

                        let funcaoDescricao = '';
                        let funcao = null;
                        if (trabalhador?.funcao_id) {
                            funcao = await funcaoGetService(empresa.id, trabalhador.funcao_id, cliente.dataValues.id);
                            funcaoDescricao = funcao.dataValues.descricao;
                        }

                        return {
                            setorDescricao,
                            funcaoDescricao,
                            funcao: funcao?.dataValues || null
                        };
                    })
                );

                return {
                    ...response,
                    trabalhadoresComSetorEFuncao
                };
            })
        );

        const gerarSetorEFuncao = (trabalhador) => {
            return [
                [
                    {
                        text: `${trabalhador.setorDescricao || "Não informado"} - ${trabalhador.funcao?.funcao || trabalhador.funcaoDescricao || "Não informada"}`,
                        fontSize: 10,
                        alignment: "left",
                        bold: true,
                        margin: [5, 0],
                        lineHeight: 1,
                        colSpan: 2
                    },
                    {}
                ],
                [
                    {
                        text: `${trabalhador.funcao?.descricao || trabalhador.funcaoDescricao || "Não informada"}`,
                        fontSize: 10,
                        alignment: "justify",
                        margin: [5, 0],
                        lineHeight: 1,
                        colSpan: 2
                    },
                    {}
                ]
            ];
        };

        const generateLaudoAsOneTable = async () => {
            const body = [];

            for (let index = 0; index < gesData.length; index++) {
                const ges = gesData[index];
                console.log(ges.dataValues.ambientesTrabalhos[0].dataValues.informacoes_adicionais)
                body.push(
                    [
                        {
                            text: "IDENTIFICAÇÃO GERAL",
                            fontSize: 10,
                            alignment: "center",
                            colSpan: 2,
                            lineHeight: 1,
                            fillColor: "#D9D9D9",
                            bold: true,
                        },
                        {}
                    ],
                    [
                        { text: "Responsável Técnico:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1 },
                        { text: "Data do Laudo:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1 }
                    ],
                    [
                        { text: `${dataResponsavelAprovacao.nome} (${dataResponsavelAprovacao.numero_crea})`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1 },
                        { text: `${dataInicioFormatada} - ${dataFimFormatada}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1 }
                    ],
                    [
                        { text: "Empresa:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1 },
                        { text: "CNPJ:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1 }
                    ],
                    [
                        { text: `${cliente.dataValues.nome_fantasia}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1 },
                        { text: `${cliente.dataValues.cnpj}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1 }
                    ],
                    [
                        { text: "Endereço:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: `${cliente.dataValues.localizacao_completa}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: "GES:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: `${ges.dataValues.descricao_ges}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: "1. OBJETIVO", fontSize: 10, alignment: "left", colSpan: 2, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                        {}
                    ],
                    [
                        {
                            text: "Este laudo tem o objetivo de verificar coletivamente as condições ambientais de trabalho conforme Decreto 3048/99 para fins de aposentadoria especial. Foi avaliado o local de trabalho com o objetivo de atestar as condições ambientais nas atividades desenvolvidas.",
                            fontSize: 10,
                            alignment: "left",
                            margin: [5, 0],
                            lineHeight: 1,
                            colSpan: 2
                        },
                        {}
                    ],
                    [
                        { text: "2. ANÁLISE SETOR E FUNÇÃO", fontSize: 10, alignment: "left", colSpan: 2, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                        {}
                    ],
                    [
                        { text: "REGISTRO DE ATIVIDADES EXECUTADAS", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    ...ges.trabalhadoresComSetorEFuncao
    .sort((a, b) => {
        const setorCompare = (a.setorDescricao || '').localeCompare(b.setorDescricao || '');
        if (setorCompare !== 0) return setorCompare;
        return (a.funcaoDescricao || '').localeCompare(b.funcaoDescricao || '');
    })
    .flatMap(gerarSetorEFuncao),

                    [
                        { text: ges.dataValues.imagens.length > 0 ? "REGISTRO FOTOGRÁFICO" : "", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],

                );

                const imagensRows = await getImages(ges.dataValues.imagens);
                if (imagensRows.length > 0) {
                    body.push(...imagensRows);
                }


                body.push(
                    [
                        { text: ges.dataValues.imagens.length > 0 ? "OBSERVAÇÕES" : "", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        {
                            text: ges.dataValues.ambientesTrabalhos
                                ?.map(a => a.dataValues.informacoes_adicionais)
                                .filter(Boolean)
                                .join('\n\n') || "Não há observações registradas.",
                            fontSize: 10,
                            alignment: "justify",
                            margin: [5, 0],
                            lineHeight: 1,
                            colSpan: 2
                        },
                        {}
                    ]
                );
                

                if (index !== gesData.length - 1) {
                    body.push([{ text: '', colSpan: 2, pageBreak: 'before' }, {}]);
                }
            }

            return body;
        };


        return {
            table: {
                widths: ['50%', '50%'],
                body: await generateLaudoAsOneTable(),
            },
            layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
            },
            margin: [-25, 0, -25, 0],
        };
    }
};
