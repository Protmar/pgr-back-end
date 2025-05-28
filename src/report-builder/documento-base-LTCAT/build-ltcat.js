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
    if (!Array.isArray(images) || images.length === 0) {
        console.warn("Nenhuma imagem fornecida ou formato inválido");
        return [];
    }

    const imagePairs = [];
    for (let i = 0; i < images.length; i += 2) {
        imagePairs.push([images[i], images[i + 1] || null]);
    }

    const getDimensions = (originalWidth, originalHeight) => {
        const maxWidth = 230;
        const maxHeight = 150;
        if (!originalWidth || !originalHeight || originalWidth <= 0 || originalHeight <= 0) {
            return { width: maxWidth, height: maxHeight };
        }
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
            return { width: originalWidth, height: originalHeight };
        }
        const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
        return {
            width: Math.round(originalWidth * scale),
            height: Math.round(originalHeight * scale),
        };
    };

    const rows = await Promise.all(
        imagePairs.map(async ([img1, img2]) => {
            try {
                const image1Key = img1?.dataValues?.name || img1?.dataValues?.url;
                if (!image1Key) {
                    throw new Error("Imagem 1 inválida ou não possui chave (name/url)");
                }

                const image2Key = img2?.dataValues?.name || img2?.dataValues?.url || null;

                const [file1, file2] = await Promise.all([
                    getFileToS3(image1Key),
                    image2Key ? getFileToS3(image2Key) : Promise.resolve(null),
                ]);

                if (!file1?.url) {
                    throw new Error("URL da imagem 1 não encontrada");
                }

                const [data1, data2] = await Promise.all([
                    getImageData(file1.url),
                    file2?.url ? getImageData(file2.url) : Promise.resolve(null),
                ]);

                if (!data1?.data || !data1?.width || !data1?.height) {
                    throw new Error("Dados da imagem 1 inválidos");
                }

                const dimensions1 = getDimensions(data1.width, data1.height);
                const dimensions2 = data2 ? getDimensions(data2.width, data2.height) : null;

                if (!data2 || !data2?.data) {
                    return [
                        {
                            colSpan: 5,
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
                        },
                        {}, {}, {}, {}
                    ];
                }

                if (!data2?.width || !data2?.height) {
                    throw new Error("Dados da imagem 2 inválidos");
                }

                return [
                    {
                        colSpan: 5,
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
                    {}, {}, {}, {}
                ];
            } catch (err) {
                console.error("Erro ao processar imagens:", err.message);
                return [{}, {}, {}, {}, {}];
            }
        })
    );

    return rows;
};

// Utiliza fetch para buscar a imagem do S3 e converter para base64
const cache = new Map(); // Cache simples em memória

const getImageAsBase64FromS3 = async (imageKey) => {
    if (cache.has(imageKey)) {
        return cache.get(imageKey);
    }

    try {
        const file = await getFileToS3(imageKey);
        if (!file?.url) {
            console.error("URL da imagem não encontrada para key:", imageKey);
            return null;
        }

        const response = await fetch(file.url);
        if (!response.ok) {
            console.error("Erro ao buscar imagem do S3, status:", response.status, response.statusText);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        const mimeType = response.headers.get("Content-Type") || "image/png";
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const base64Image = `data:${mimeType};base64,${base64}`;

        cache.set(imageKey, base64Image);
        return base64Image;
    } catch (error) {
        console.error("Erro ao converter imagem para base64, key:", imageKey, "Erro:", error);
        return null;
    }
};



module.exports = {
    buildLTCAT: async (empresa, servicoId, gesIds, cliente) => {
        // Verificações iniciais de entrada
        if (!empresa?.id) {
            throw new Error("Empresa não fornecida ou ID inválido");
        }
        if (!servicoId) {
            throw new Error("ID do serviço não fornecido");
        }
        if (!Array.isArray(gesIds) || gesIds.length === 0) {
            throw new Error("Lista de GES vazia ou inválida");
        }
        if (!cliente?.dataValues?.id) {
            throw new Error("Cliente não fornecido ou ID inválido");
        }

        const getDataResponsavel = async (empresa, servicoId) => {
            const servicoResponse = await getDadosServicoByEmpresaServico(empresa.id, servicoId);
            if (!servicoResponse?.dataValues?.id_responsavel_aprovacao) {
                throw new Error("Serviço ou responsável de aprovação não encontrado");
            }
            const id_responsavel_aprovacao = servicoResponse.dataValues.id_responsavel_aprovacao;
            const response = await getOneResponsavelTecnicoService(empresa.id, id_responsavel_aprovacao, cliente.dataValues.id);
            if (!response?.dataValues) {
                throw new Error("Responsável técnico não encontrado");
            }
            return response.dataValues;
        };

        const dataResponsavelAprovacao = await getDataResponsavel(empresa, servicoId);
        const dataServico = await getDadosServicoByEmpresaServico(empresa.id, servicoId);
        if (!dataServico?.dataValues) {
            throw new Error("Dados do serviço não encontrados");
        }

        const dataInicioFormatada = dataServico.dataValues.data_inicio
            ? moment(dataServico.dataValues.data_inicio).format('DD/MM/YYYY')
            : "Data não informada";
        const dataFimFormatada = dataServico.dataValues.data_fim
            ? moment(dataServico.dataValues.data_fim).format('DD/MM/YYYY')
            : "Data não informada";

        const gesData = await Promise.all(
            gesIds.map(async (gesId) => {
                if (!gesId) {
                    console.warn("GES ID inválido, ignorando...");
                    return null;
                }
                const response = await getOneGesService(empresa.id, gesId, cliente.dataValues.id);
                if (!response?.dataValues) {
                    console.warn(`Dados do GES ${gesId} não encontrados`);
                    return null;
                }

                const trabalhadores = Array.isArray(response.dataValues.trabalhadores.trabalhadores)
                    ? response.dataValues.trabalhadores.trabalhadores
                    : [];

                const trabalhadoresComSetorEFuncao = await Promise.all(
                    trabalhadores.map(async (t) => {
                        if (!t?.dataValues?.trabalhador) {
                            console.warn("Trabalhador inválido, ignorando...");
                            return { setorDescricao: "Não informado", funcaoDescricao: "Não informado", funcao: null };
                        }

                        const trabalhador = t.dataValues.trabalhador;
                        let setorDescricao = "Não informado";
                        if (trabalhador?.setor_id) {
                            const setor = await setorGetService(empresa.id, trabalhador.setor_id, cliente.dataValues.id);
                            setorDescricao = setor?.dataValues?.descricao || "Não informado";
                        }

                        let funcaoDescricao = "Não informado";
                        let funcao = null;
                        if (trabalhador?.funcao_id) {
                            const funcaoResponse = await funcaoGetService(empresa.id, trabalhador.funcao_id, cliente.dataValues.id);
                            funcao = funcaoResponse?.dataValues || null;
                            funcaoDescricao = funcao?.descricao || "Não informado";
                        }

                        return {
                            setorDescricao,
                            funcaoDescricao,
                            funcao
                        };
                    })
                );

                return {
                    ...response,
                    trabalhadoresComSetorEFuncao
                };
            })


        );

        // Filtra GES nulos
        const validGesData = gesData.filter(ges => ges !== null);
        if (validGesData.length === 0) {
            throw new Error("Nenhum dado de GES válido encontrado");
        }

        const gerarSetorEFuncao = (trabalhador) => {
            if (!trabalhador) {
                return [
                    [
                        {
                            text: "Setor/Função não informado",
                            fontSize: 10,
                            alignment: "justify",
                            bold: true,
                            margin: [5, 0],
                            lineHeight: 1,
                            colSpan: 5
                        },
                        {}, {}, {}, {}
                    ]
                ];
            }

            return [
                [
                    {
                        text: `${trabalhador.setorDescricao || "Não informado"} - ${trabalhador.funcao?.funcao || trabalhador.funcaoDescricao || "Não informada"}`,
                        fontSize: 10,
                        alignment: "justify",
                        bold: true,
                        margin: [5, 0],
                        lineHeight: 1,
                        colSpan: 5
                    },
                    {}, {}, {}, {}
                ],
                [
                    {
                        text: `${trabalhador.funcao?.descricao || trabalhador.funcaoDescricao || "Não informada"}`,
                        fontSize: 10,
                        alignment: "justify",
                        margin: [5, 0],
                        lineHeight: 1,
                        colSpan: 5
                    },
                    {}, {}, {}, {}
                ]
            ];
        };

        const todasImagens = [];

        const generateLaudoAsOneTable = async () => {
            const body = [];

            for (let index = 0; index < validGesData.length; index++) {
                const ges = validGesData[index];
                if (index == 0) {
                    body.push(
                        [
                            {
                                text: "IDENTIFICAÇÃO GERAL",
                                fontSize: 10,
                                alignment: "center",
                                colSpan: 5,
                                lineHeight: 1,
                                fillColor: "#D9D9D9",
                                bold: true,
                            },
                            {}, {}, {}, {}
                        ],
                    )
                } else {
                    body.push(
                        [
                            {
                                text: "IDENTIFICAÇÃO GERAL",
                                fontSize: 10,
                                alignment: "center",
                                colSpan: 5,
                                lineHeight: 1,
                                fillColor: "#D9D9D9",
                                bold: true,
                                pageBreak: "before"
                            },
                            {}, {}, {}, {}
                        ],
                    )
                }
                body.push(
                    [
                        { text: "Responsável Técnico:", fontSize: 10, alignment: "justify", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: "Data do Laudo:", fontSize: 10, alignment: "justify", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: `${dataResponsavelAprovacao?.nome || "Não informado"} (${dataResponsavelAprovacao?.numero_crea || "Não informado"})`, fontSize: 10, alignment: "justify", margin: [5, 0], lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: `${dataInicioFormatada} - ${dataFimFormatada}`, fontSize: 10, alignment: "justify", margin: [5, 0], lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: "Empresa:", fontSize: 10, alignment: "justify", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: "CNPJ:", fontSize: 10, alignment: "justify", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: `${cliente?.dataValues?.nome_fantasia || "Não informado"}`, fontSize: 10, alignment: "justify", margin: [5, 0], lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: `${cliente?.dataValues?.cnpj || "Não informado"}`, fontSize: 10, alignment: "justify", margin: [5, 0], lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: "Endereço:", fontSize: 10, alignment: "justify", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: `${cliente?.dataValues?.localizacao_completa || "Não informado"}`, fontSize: 10, alignment: "justify", margin: [5, 0], lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "GES:", fontSize: 10, alignment: "justify", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: `${ges?.dataValues?.descricao_ges || "Não informado"}`, fontSize: 10, alignment: "justify", margin: [5, 0], lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "1. OBJETIVO", fontSize: 10, alignment: "justify", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                        {}, {}, {}, {}
                    ],
                    [
                        {
                            text: "Este laudo tem o objetivo de verificar coletivamente as condições ambientais de trabalho conforme Decreto 3048/99 para fins de aposentadoria especial. Foi avaliado o local de trabalho com o objetivo de atestar as condições ambientais nas atividades desenvolvidas.",
                            fontSize: 10,
                            alignment: "justify",
                            margin: [5, 0],
                            lineHeight: 1,
                            colSpan: 5
                        },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "2. ANÁLISE SETOR E FUNÇÃO", fontSize: 10, alignment: "justify", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "REGISTRO DE ATIVIDADES EXECUTADAS", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    ...(ges?.dataValues?.trabalhadores.trabalhadores?.length > 0
                        ? Array.from(
                            new Map(
                                ges.trabalhadoresComSetorEFuncao.map(item => [
                                    `${item?.setorDescricao || ''}-${item?.funcaoDescricao || ''}`,
                                    item
                                ])
                            ).values()
                        )
                            .sort((a, b) => {
                                const setorCompare = (a?.setorDescricao || '').localeCompare(b?.setorDescricao || '');
                                if (setorCompare !== 0) return setorCompare;
                                return (a?.funcaoDescricao || '').localeCompare(b?.funcaoDescricao || '');
                            })
                            .flatMap(gerarSetorEFuncao)
                        : [
                            [
                                {
                                    text: "Nenhum trabalhador registrado",
                                    fontSize: 10,
                                    alignment: "justify",
                                    margin: [5, 0],
                                    lineHeight: 1,
                                    colSpan: 5
                                },
                                {}, {}, {}, {}
                            ]
                        ]),
                );

                if (ges?.dataValues?.ambientesTrabalhos?.ambientesTrabalhos.length > 0) {
                    body.push(
                        [
                            { text: "DESCRIÇÃO DO LOCAL DE TRABALHO", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                            {}, {}, {}, {}
                        ],
                        [
                            {
                                text: ges?.dataValues?.ambientesTrabalhos?.ambientesTrabalhos.length > 0
                                    ? ges.dataValues.ambientesTrabalhos
                                        ?.ambientesTrabalhos.map(a => a?.dataValues?.informacoes_adicionais)
                                        .filter(Boolean)
                                        .join('\n\n') || "Não há observações registradas."
                                    : "Não há observações registradas.",
                                fontSize: 10,
                                alignment: "justify",
                                margin: [5, 0],
                                lineHeight: 1,
                                colSpan: 5
                            },
                            {}, {}, {}, {}
                        ],
                    );
                }

                if (ges?.dataValues?.imagens?.imagens.length > 0) {
                    body.push(
                        [
                            { text: "REGISTRO FOTOGRÁFICO", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                            {}, {}, {}, {}
                        ]
                    );


                    const imagensRows = await getImages(ges?.dataValues?.imagens.imagens || []);
                    if (imagensRows.length > 0) {
                        body.push(...imagensRows);
                    }
                }

                if (ges?.dataValues?.riscos?.riscos.length > 0) {
                    body.push(
                        [{ text: '', colSpan: 5, pageBreak: 'before' }, {}, {}, {}, {}],
                        [
                            { text: "3.  IDENTIFICAÇÃO DE AGENTE NOCIVO CAPAZ DE CAUSAR DANO À SAÚDE E INTEGRIDADE FÍSICA, ARROLADO NA LEGISLAÇÃO PREVIDENCIÁRIA", fontSize: 10, alignment: "justify", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                            {}, {}, {}, {}
                        ],
                    );

                    ges?.dataValues?.riscos.riscos.map(async risco => {
                        body.push(
                            [
                                {
                                    table: {
                                        widths: ['50%', '50%'],
                                        body: [
                                            [
                                                {
                                                    text: 'Risco: ',
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1,
                                                    color: "white",
                                                    fillColor: "#000000",
                                                },
                                                {
                                                    text: 'Agente nocivo: ',
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1,
                                                    color: "white",
                                                    fillColor: "#000000",
                                                },
                                            ],
                                            [
                                                {
                                                    text: risco?.dataValues.fatorRisco.dataValues.tipo,
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1,
                                                    color: "white",
                                                    fillColor: "#000000",
                                                },
                                                {
                                                    text: risco?.dataValues.fatorRisco.dataValues.descricao,
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1,
                                                    color: "white",
                                                    fillColor: "#000000",
                                                },
                                            ]
                                        ]
                                    },
                                    layout: 'centerLTCATVertically',
                                    colSpan: 5,
                                    margin: [-5, -3, -5, -3],
                                    lineHeight: 0.5
                                },
                                {}, {}, {}, {}
                            ],
                            [
                                {
                                    table: {
                                        widths: ['50%', '50%'],
                                        body: [
                                            [
                                                {
                                                    text: 'Localização de possíveis fontes geradoras:',
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1
                                                },
                                                {
                                                    text: 'Via e periodicidade de exposição ao agente nocivo:',
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1
                                                }
                                            ]
                                        ]
                                    },
                                    layout: 'centerLTCATVertically',
                                    colSpan: 5,
                                    margin: [-5, -3, -5, -3],
                                    lineHeight: 0.5
                                },
                                {}, {}, {}, {}
                            ],
                            [
                                {
                                    table: {
                                        widths: ['50%', '50%'],
                                        body: [
                                            [
                                                {
                                                    text: `${risco.fonteGeradora?.dataValues?.descricao || "Não informado"}`,
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1
                                                },
                                                {
                                                    text: `Exposição: ${risco.dataValues.exposicao.dataValues.descricao}; Meio de Propagação: ${risco.dataValues.trajetoria.dataValues.descricao}; Trajetória: ${risco.dataValues.meioPropagacao.dataValues.descricao}`,
                                                    fontSize: 10,
                                                    alignment: 'justify',
                                                    margin: [5, 0],
                                                    bold: true,
                                                    lineHeight: 1
                                                }
                                            ]
                                        ]
                                    },
                                    layout: 'centerLTCATVertically',
                                    colSpan: 5,
                                    margin: [-5, -3, -5, -3],
                                    lineHeight: 0.5
                                },
                                {}, {}, {}, {}
                            ],
                            [
                                { text: "CRITÉRIO DE AVALIAÇÃO", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                {}, {}, {}, {}
                            ],
                            [
                                { text: risco?.dataValues.tecnicaUtilizada.dataValues.descricao, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1, colSpan: 5 },
                                {}, {}, {}, {}
                            ],


                        );

                        if (risco?.dataValues.fatorRisco.dataValues.parametro == "Quantitativo") {
                            body.push(
                                [
                                    { text: "INTERPRETAÇÃO DOS RESULTADOS", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "Medida Geométrica (MG) / Intens. / Conc.", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Desvio Padrão Geométrico (DPG)", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Percentil 95", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "LT / LE", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Nível de Ação", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                ],
                                [
                                    { text: `${risco?.intens_conc}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.desvio_padrao}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.percentil}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.lt_le}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.nivel_acao}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                ],
                                [
                                    { text: "Consultar anexos para verificação (dados do equipamento, data calibração, aferição inicial e final, data, trabalhador amostrado, intes. / conc. e Tempo de exposição)", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "LE - Limite de Exposição conforme NR-15 ou Legislação Internacional; LT - Limite de Tolerânicia conforme NR-15; NA - Nível de Ação conforme NR-9", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}

                                ],
                                [
                                    { text: "REGISTRO DE CONDIÇÕES ANORMAIS", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {},
                                    { text: "DADOS CONFIÁVEIS", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                ],
                                [
                                    {
                                        text: " Nenhuma condição não conforme encontrada durante o planejamento, preparativos e calibração. Nenhuma interferência detectada e nenhuma objeção do trabalhador.",
                                        fontSize: 10,
                                        alignment: "center",
                                        margin: [5, 0, 5, 0],
                                        bold: true,
                                        lineHeight: 1,
                                        colSpan: 4
                                    },
                                    {}, {}, {},
                                    {
                                        table: {
                                            widths: ['50%', '50%'],
                                            body: [
                                                [
                                                    { text: "Sim", fontSize: 10, margin: [5, 0], alignment: "center", bold: true, lineHeight: 1 },
                                                    { text: "Não", fontSize: 10, margin: [5, 0], alignment: "center", bold: true, lineHeight: 1 }
                                                ],
                                                [
                                                    { text: "X", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 },
                                                    { text: "", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 }
                                                ]
                                            ],
                                        },
                                        layout: {
                                            hLineWidth: function (i, node) {
                                                if (i === 1) {
                                                    return 1;
                                                }
                                                return 0;
                                            },
                                            vLineWidth: function (i, node) {
                                                return (i === 1) ? 1 : 0;
                                            },
                                            paddingLeft: function (i, node) { return 5; },
                                            paddingRight: function (i, node) { return 5; },
                                        },
                                        margin: [-4, -3, -4, -3],
                                    }
                                ],
                            );
                        }

                        const medidasColetivas = risco.dataValues.relacoes_coletivas?.map(relacao => relacao.dataValues.medidas_coletivas_existentes?.dataValues?.descrica).filter(Boolean).join("; ");
                        const medidasAdministrativas = risco.dataValues.relacoes_administrativas?.map(relacao => relacao.dataValues.medidas_administrativas_existen).filter(Boolean).join("; ");
                        const medidasIndividuais = risco.dataValues.relacoes_individuais?.map(relacao => relacao.dataValues.medidas_individuais_existentes?.dataValues?.desc).filter(Boolean).join("; ");

                        // MEDIDAS DE CONTROLE EXISTENTES
                        if (medidasColetivas || medidasAdministrativas || medidasIndividuais) {
                            body.push(
                                [
                                    { text: "MEDIDAS DE CONTROLE", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            medidasColetivas ? { text: `• Medida de Controle Coletiva Existente: `, bold: true } : null,
                                            medidasColetivas ? { text: ` ${medidasColetivas}.\n` } : null,

                                            medidasAdministrativas ? { text: `• Medida de Controle Administrativa Existente: `, bold: true } : null,
                                            medidasAdministrativas ? { text: ` ${medidasAdministrativas}.\n` } : null,

                                            medidasIndividuais ? { text: `• Medida de Controle Individual Existente: `, bold: true } : null,
                                            medidasIndividuais ? { text: ` ${medidasIndividuais}.\n` } : null,
                                        ].filter(Boolean),
                                        fontSize: 10,
                                        alignment: "justify",
                                        margin: [5, 0, 5, 0],
                                        lineHeight: 1,
                                        colSpan: 5
                                    },
                                    {}, {}, {}, {}
                                ]
                            );
                        }

                        // MEDIDAS A SEREM IMPLANTADAS
                        const medidasColetivasNec = (risco.dataValues.planosAcao?.flatMap(plano =>
                            plano.dataValues.riscosColetivosNecessaria?.flatMap(m => m.dataValues.medidas_coletivas_n || [])
                        ) || []).filter(Boolean).join("; ");

                        const medidasAdministrativasNec = (risco.dataValues.planosAcao?.flatMap(plano =>
                            plano.dataValues.riscosAdministrativosNecessaria?.flatMap(m => m.dataValues.medidas_admin || [])
                        ) || []).filter(Boolean).join("; ");

                        const medidasIndividuaisNec = (risco.dataValues.planosAcao?.flatMap(plano =>
                            plano.dataValues.riscosIndividuaisNecessaria?.flatMap(m => m.dataValues.medidas_individua || [])
                        ) || []).filter(Boolean).join("; ");

                        if (medidasColetivasNec || medidasAdministrativasNec || medidasIndividuaisNec) {
                            body.push(
                                [
                                    { text: "MEDIDAS DE CONTROLE A SEREM IMPLANTADAS", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            medidasColetivasNec ? { text: `• Medida de Controle Coletiva Necessária: `, bold: true } : null,
                                            medidasColetivasNec ? { text: ` ${medidasColetivasNec}.\n` } : null,

                                            medidasAdministrativasNec ? { text: `• Medida de Controle Administrativa Necessária: `, bold: true } : null,
                                            medidasAdministrativasNec ? { text: ` ${medidasAdministrativasNec}.\n` } : null,

                                            medidasIndividuaisNec ? { text: `• Medida de Controle Individual Necessária: `, bold: true } : null,
                                            medidasIndividuaisNec ? { text: ` ${medidasIndividuaisNec}.\n` } : null,
                                        ].filter(Boolean),
                                        fontSize: 10,
                                        alignment: "justify",
                                        margin: [5, 0, 5, 0],
                                        lineHeight: 1,
                                        colSpan: 5
                                    },
                                    {}, {}, {}, {}
                                ]
                            );


                        }

                        body.push(
                            [
                                { text: "ANÁLISE FINAL DO GES", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                {}, {}, {}, {}
                            ],
                            [
                                { text: "VERIFICAÇÕES REALIZADAS", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                {}, {}, {}, {}
                            ],
                            [
                                { text: "Tópico", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Pontos de Verificação", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],
                            [
                                { text: "Planejamento e Preparativos", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Integridade eletromecânica do aparelho, baterias, laudo de calibração RBC Inmetro, aferidores (se aplicável) e folha de campo.", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],
                            [
                                { text: "Aferição", fontSize: 10, alignment: "center", margin: [5, 10, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Prevista aferição do aparelho antes e depois da avaliação, em local adequado. A avaliação foi invalidada se a aferição acusar variação fora da faixa tolerada pelas normas de higiene ocupacional da Fundacentro e/ou se a bateria estver abaixo do nível aceitável.", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],
                            [
                                { text: "Posicionamento", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Posicionamento do aparelho para avaliação conforme normas de higiene ocupacional da Fundacentro.", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],
                            [
                                { text: "Interferência", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Não foi permitdo o uso de rádio ou outras infuências eletromagnétcas, chuva, umidade e calor excessivo.", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],
                            [
                                { text: "Informar o trabalhador", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Foi informado objetvo do trabalho: avaliação não deve interferir em suas atvidades habituais; o aparelho não efetua gravação de conversas; o aparelho só deve ser removido pelo avaliador; aparelho não pode ser tocado ou obstruído.", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],
                            [
                                { text: "Projeção da avaliação", fontSize: 10, alignment: "center", margin: [5, 25, 5, 0], bold: true, lineHeight: 1, colSpan: 1 },
                                { text: "Foi utlizada a projeção da avaliação: \na) pelo conhecimento das atvidades e do processo, e pelo acompanhamento feito durante a amostragem, que o período não amostrado é essencialmente igual ao amostrado do ponto de vista da exposição ao agente.\n b) pelas mesmas razões supracitadas, que a exposição ocupacional no período não amostrado, foi nula (exposição zero). Anexo a este laudo encontra-se o histograma ou relatório de ensaio.", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 4 },
                                {}, {}, {}
                            ],

                        );

                        risco.dataValues?.imagensFichaCampo?.forEach(e => {
                            if (e.dataValues.file_type === 'image/png') {
                                todasImagens.push({ tabela: "Ficha de Campo", tipo: risco?.dataValues.fatorRisco.dataValues.tipo, descricaoRisco: risco?.dataValues.fatorRisco.dataValues.descricao, url: e.dataValues.url, base64: "" });
                            }
                        });

                        risco.dataValues?.imagensFotoAvaliacao?.forEach(e => {
                            if (e.dataValues.file_type === 'image/png') {
                                todasImagens.push({ tabela: "Foto Avaliação", tipo: risco?.dataValues.fatorRisco.dataValues.tipo, descricaoRisco: risco?.dataValues.fatorRisco.dataValues.descricao, url: e.dataValues.url, base64: "" });
                            }
                        });

                        risco.dataValues?.imagensHistogramas?.forEach(e => {
                            if (e.dataValues.file_type === 'image/png') {
                                todasImagens.push({ tabela: "Histogramas", tipo: risco?.dataValues.fatorRisco.dataValues.tipo, descricaoRisco: risco?.dataValues.fatorRisco.dataValues.descricao, url: e.dataValues.url, base64: "" });
                            }
                        });

                        risco.dataValues?.imagensMemorialCalculo?.forEach(e => {
                            if (e.dataValues.file_type === 'image/png') {
                                todasImagens.push({ tabela: "Memorial de Cálculo", tipo: risco?.dataValues.fatorRisco.dataValues.tipo, descricaoRisco: risco?.dataValues.fatorRisco.dataValues.descricao, url: e.dataValues.url, base64: "" });
                            }
                        });



                    },

                    );

                }



                // body.push(
                //     [
                //         { text: "4. QUADRO RESUMIDO COM OS RISCOS PARA LANÇAMENTO NO PPP", fontSize: 10, alignment: "justify", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                //         {}, {}, {}, {}
                //     ],
                //     [
                //         { text: "CONFIRMAR COM O CADU", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 5 },
                //         {}, {}, {}, {}
                //     ],
                //     [
                //         { text: "5. CONCLUSÃO FINAL", fontSize: 10, alignment: "justify", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                //         {}, {}, {}, {}
                //     ],
                //     [
                //         { text: "CONFIRMAR COM O CADU", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 5 },
                //         {}, {}, {}, {}
                //     ],
                //     [
                //         { text: "ASSINATURA DO ENGENHEIRO RESPONSÁVEL", fontSize: 10, alignment: "center", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                //         {}, {}, {}, {}
                //     ],
                //     [
                //         { text: "CONFIRMAR COM O CADU", fontSize: 10, alignment: "justify", margin: [5, 0, 5, 0], bold: false, lineHeight: 1, colSpan: 5 },
                //         {}, {}, {}, {}
                //     ],
                //     [
                //         { text: `${dataResponsavelAprovacao?.nome || "Não informado"} (CREA-${dataResponsavelAprovacao?.estado_crea || "Não informado" } ${dataResponsavelAprovacao?.numero_crea || "Não informado"})`, fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                //         {}, {}, {}, {}
                //     ],

                //     [{ text: '', colSpan: 5, pageBreak: 'before' }, {}, {}, {}, {}],

                // )

            }

            await Promise.all(todasImagens.map(async (e) => {
                const dataUrl = await getFileToS3(e.url);
                e.url = dataUrl.url;

                const image64 = await getImageData(dataUrl.url);
                e.base64 = image64.data;
            }));

            if (todasImagens.length > 0) {
                body.push(
                    [
                        { text: "7. Imagens", pageBreak: 'before', fontSize: 10, alignment: "justify", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                        {}, {}, {}, {}
                    ],
                )
            }


            for (let i = 0; i < todasImagens.length; i += 2) {
                const bloco1 = todasImagens[i];
                const bloco2 = todasImagens[i + 1];

                const pageContent = [
                    {
                        stack: [
                            {
                                text: `${bloco1.tabela} - Tipo: ${bloco1.tipo} - Descrição: ${bloco1.descricaoRisco}`,
                                fontSize: 10,
                                alignment: "justify",
                                margin: [5, 5, 5, 10],
                                lineHeight: 1.2,
                            },
                            {
                                image: bloco1.base64,
                                width: 250,
                                height: 250,
                                alignment: 'center',
                                margin: [0, 0, 0, 10],
                            }
                        ],
                        colSpan: 5,
                        margin: [0, 0, 0, 0],
                    },
                    {}, {}, {}, {}
                ];

                const segundaLinha = bloco2
                    ? [
                        {
                            stack: [
                                {
                                    text: `${bloco2.tabela} - Tipo: ${bloco2.tipo} - Descrição: ${bloco2.descricaoRisco}`,
                                    fontSize: 10,
                                    alignment: "justify",
                                    margin: [5, 5, 5, 10],
                                    lineHeight: 1.2,
                                },
                                {
                                    image: bloco2.base64,
                                    width: 250,
                                    height: 250,
                                    alignment: 'center',
                                    margin: [0, 0, 0, 10],
                                }
                            ],
                            colSpan: 5,
                            margin: [0, 0, 0, 0],
                        },
                        {}, {}, {}, {}
                    ]
                    : null;

                body.push(pageContent);
                if (segundaLinha) {
                    body.push(segundaLinha);
                }

                if (i + 2 < todasImagens.length) {
                    body.push([
                        { text: '', colSpan: 5, pageBreak: 'after' },
                        {}, {}, {}, {}
                    ]);
                }
            }

            return body;
        };

        return {
            table: {
                widths: ['20%', '20%', '20%', '20%', '20%'],
                body: await generateLaudoAsOneTable(),
            },
            layout: "centerLTCATVertically",
            margin: [-25, 0, -25, 0],
        };
    }
};