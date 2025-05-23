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
    // Verificação de entrada
    if (!Array.isArray(images) || images.length === 0) {
        console.warn("Nenhuma imagem fornecida ou formato inválido");
        return [];
    }

    const imagePairs = [];
    for (let i = 0; i < images.length; i += 2) {
        const image1 = images[i];
        const image2 = images[i + 1] || null;
        imagePairs.push([image1, image2]);
    }

    const getDimensions = (originalWidth, originalHeight) => {
        const maxWidth = 230;
        const maxHeight = 150;

        // Verificação de dimensões válidas
        if (!originalWidth || !originalHeight || originalWidth <= 0 || originalHeight <= 0) {
            return { width: maxWidth, height: maxHeight };
        }

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
                // Verificação de imagem 1
                if (!img1?.dataValues?.name) {
                    throw new Error("Imagem 1 inválida ou não possui nome");
                }

                const [file1, file2] = await Promise.all([
                    getFileToS3(img1.dataValues.name),
                    img2?.dataValues?.name ? getFileToS3(img2.dataValues.name) : null,
                ]);

                // Verificação de URL do arquivo
                if (!file1?.url) {
                    throw new Error("URL da imagem 1 não encontrada");
                }

                const [data1, data2] = await Promise.all([
                    getImageData(file1.url),
                    file2?.url ? getImageData(file2.url) : null,
                ]);

                // Verificação de dados da imagem
                if (!data1?.data || !data1?.width || !data1?.height) {
                    throw new Error("Dados da imagem 1 inválidos");
                }

                const dimensions1 = getDimensions(data1.width, data1.height);
                const dimensions2 = data2 ? getDimensions(data2.width, data2.height) : null;

                if (!data2 || !data2?.data) {
                    // Imagem única, centraliza na linha inteira
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

                // Verificação de dados da imagem 2
                if (!data2?.width || !data2?.height) {
                    throw new Error("Dados da imagem 2 inválidos");
                }

                // Duas imagens na linha, cada uma centralizada em sua metade
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
                console.error("Erro ao processar imagens adicionais:", err.message);
                return [{}, {}, {}, {}, {}];
            }
        })
    );

    return rows;
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
                            alignment: "left",
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
                        alignment: "left",
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

        const generateLaudoAsOneTable = async () => {
            const body = [];

            for (let index = 0; index < validGesData.length; index++) {
                const ges = validGesData[index];
                console.log("AAA", ges.dataValues.riscos.riscos[0].dataValues.risco_administrativa_existente);
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
                    [
                        { text: "Responsável Técnico:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: "Data do Laudo:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: `${dataResponsavelAprovacao?.nome || "Não informado"} (${dataResponsavelAprovacao?.numero_crea || "Não informado"})`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: `${dataInicioFormatada} - ${dataFimFormatada}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: "Empresa:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: "CNPJ:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: `${cliente?.dataValues?.nome_fantasia || "Não informado"}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 3 },
                        {}, {},
                        { text: `${cliente?.dataValues?.cnpj || "Não informado"}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 2 },
                        {}
                    ],
                    [
                        { text: "Endereço:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: `${cliente?.dataValues?.localizacao_completa || "Não informado"}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "GES:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: `${ges?.dataValues?.descricao_ges || "Não informado"}`, fontSize: 10, alignment: "left", margin: [5, 0], lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "1. OBJETIVO", fontSize: 10, alignment: "left", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                        {}, {}, {}, {}
                    ],
                    [
                        {
                            text: "Este laudo tem o objetivo de verificar coletivamente as condições ambientais de trabalho conforme Decreto 3048/99 para fins de aposentadoria especial. Foi avaliado o local de trabalho com o objetivo de atestar as condições ambientais nas atividades desenvolvidas.",
                            fontSize: 10,
                            alignment: "left",
                            margin: [5, 0],
                            lineHeight: 1,
                            colSpan: 5
                        },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "2. ANÁLISE SETOR E FUNÇÃO", fontSize: 10, alignment: "left", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
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
                                    alignment: "left",
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
                            { text: "3.  IDENTIFICAÇÃO DE AGENTE NOCIVO CAPAZ DE CAUSAR DANO À SAÚDE E INTEGRIDADE FÍSICA, ARROLADO NA LEGISLAÇÃO PREVIDENCIÁRIA", fontSize: 10, alignment: "left", colSpan: 5, lineHeight: 1, fillColor: "#D9D9D9", bold: true },
                            {}, {}, {}, {}
                        ],
                    );
                    ges?.dataValues?.riscos.riscos.map(risco => {
                        body.push(
                            [
                                { text: `Risco: ${risco?.dataValues.fatorRisco.dataValues.tipo}`, fontSize: 10, alignment: "left", colSpan: 5, lineHeight: 1, color: "white", fillColor: "#000000", bold: true },
                                {}, {}, {}, {}
                            ],
                            [
                                { text: "Localização de possíveis fontes geradoras:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 3 },
                                {}, {},
                                { text: "Via e periodicidade de exposição ao agente nocivo:", fontSize: 10, alignment: "left", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 2 },
                                {}
                            ],
                            [
                                { text: `${risco.fonteGeradora?.dataValues?.descricao || "Não informado"}`, fontSize: 10, alignment: "left", margin: [5, 0], bold: false, lineHeight: 1, colSpan: 3 },
                                {}, {},
                                { text: "Confirmar com o CADU", fontSize: 10, alignment: "left", margin: [5, 0], bold: false, lineHeight: 1, colSpan: 2 },
                                {}
                            ],
                            [
                                { text: "CRITÉRIO DE AVALIAÇÃO", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                {}, {}, {}, {}
                            ],
                            [
                                { text: "Confirmar com CADU", fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1, colSpan: 5 },
                                {}, {}, {}, {}
                            ],
                        );

                        if (risco?.dataValues.fatorRisco.dataValues.parametro == "Quantitativo") {
                            console.log("RISCO", risco.dataValues.relacoes_coletivas[0].dataValues.medidas_coletivas_existentes.dataValues.descrica )
                            body.push(
                                [
                                    { text: "AVALIAÇÕES", fontSize: 10, alignment: "center", margin: [5, 10, 5, 10], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "Data", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Trabalhador Amostrado", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Intens. / Conc.", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Tempo Exposição", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Histograma / Relatório Ensaio", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                ],
                                [
                                    { text: "Confirmar com o CADU", fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: "Confirmar com o CADU", fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.intens_conc}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: "Confirmar com o CADU", fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: "Confirmar com o CADU", fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                ],
                                [
                                    { text: "Consultar ficha de campo para verificação (dados do equipamento, data calibração, aferição inicial e final)", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "INTERPRETAÇÃO DOS RESULTADOS", fontSize: 10, alignment: "center", margin: [5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "Medida Geométrica (MG)", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Desvio Padrão Geométrico (DPG)", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Percentil 95", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "LT / LE", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                    { text: "Nível de Ação", fontSize: 10, alignment: "center", margin: [5, 5, 5, 0], bold: true, lineHeight: 1 },
                                ],
                                [
                                    { text: "Confirmar com o CADU", fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.desvio_padrao}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.percentil}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.lt_le}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
                                    { text: `${risco?.nivel_acao}`, fontSize: 10, alignment: "center", margin: [5, 0], bold: false, lineHeight: 1 },
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
                                [
                                    { text: "MEDIDAS DE CONTROLE", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `• Medida de Controle Administrativa Existente:`, bold: true },
                                            { text: ` ${ risco.dataValues.relacoes_administrativas.map(relacao => relacao.dataValues.medidas_administrativas_existen).join("; ") || "Não informado."}.\n` },
                                            { text: `• Medida de Controle Coletiva Existente:`, bold: true },
                                            { text: ` ${ risco.dataValues.relacoes_coletivas.map(relacao => relacao.dataValues.medidas_coletivas_existentes.dataValues.descrica).join("; ") || "Não informado."}.\n` },
                                            { text: `• Medida de Controle Individual Existente:`, bold: true },
                                            { text: ` ${ risco.dataValues.relacoes_individuais.map(relacao => relacao.dataValues.medidas_individuais_existentes.dataValues.desc).join("; ") || "Não informado."}.\n` },
                                        ],
                                        fontSize: 10,
                                        alignment: "left",
                                        margin: [5, 0, 5, 0],
                                        lineHeight: 1,
                                        colSpan: 5
                                    },{}, {}, {}, {}
                                ],
                                [
                                    { text: "MEDIDAS DE CONTROLE A SEREM IMPLANTADAS", fontSize: 10, alignment: "center", margin: [5, 0, 5, 0], bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `• Medida de Controle Administrativa Existente:`, bold: true },
                                            { text: ` ${ risco.dataValues.relacoes_administrativas.map(relacao => relacao.dataValues.medidas_administrativas_existen).join("; ") || "Não informado."}.\n` },
                                            { text: `• Medida de Controle Coletiva Existente:`, bold: true },
                                            { text: ` ${ risco.dataValues.relacoes_coletivas.map(relacao => relacao.dataValues.medidas_coletivas_existentes.dataValues.descrica).join("; ") || "Não informado."}.\n` },
                                            { text: `• Medida de Controle Individual Existente:`, bold: true },
                                            { text: ` ${ risco.dataValues.relacoes_individuais.map(relacao => relacao.dataValues.medidas_individuais_existentes.dataValues.desc).join("; ") || "Não informado."}.\n` },
                                        ],
                                        fontSize: 10,
                                        alignment: "left",
                                        margin: [5, 0, 5, 0],
                                        lineHeight: 1,
                                        colSpan: 5
                                    },{}, {}, {}, {}
                                ],
                                [
                                    { text: '', colSpan: 5, pageBreak: 'before' }, {}, {}, {}, {}
                                ]
                            );
                        }
                    });
                }

                if (index !== validGesData.length - 1) {
                    body.push([{ text: '', colSpan: 5, pageBreak: 'before' }, {}, {}, {}, {}]);
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