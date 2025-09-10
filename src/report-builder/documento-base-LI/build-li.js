/* eslint-disable @typescript-eslint/no-var-requires */
const moment = require('moment');
const { getDadosServicoByEmpresaServico, getDadosServicoByEmpresaServicoToDocbase, getResponsavelByServico, getOneServico } = require('../../services/servicos/');
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
        return [[{ text: "Nenhuma imagem disponível", colSpan: 2, alignment: "center", fontSize: 10 }, {}]];
    }

    const getDimensions = (originalWidth, originalHeight) => {
        const maxWidth = 230;
        const maxHeight = 150;
        if (!originalWidth || !originalHeight || originalWidth <= 0 || originalHeight <= 0) {
            return { width: maxWidth, height: maxHeight };
        }
        const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight, 1);
        return {
            width: Math.round(originalWidth * scale),
            height: Math.round(originalHeight * scale),
        };
    };

    const rows = await Promise.all(
        images.map(async (img) => {
            try {
                if (!img?.name) throw new Error("Imagem inválida");

                const file = await getFileToS3(img.name);
                const data = file?.url ? await getImageData(file.url) : null;

                if (!data?.data) throw new Error("Dados da imagem inválidos");

                const dimensions = getDimensions(data.width, data.height);

                return [
                    {
                        image: data.data,
                        width: dimensions.width,
                        height: dimensions.height,
                        alignment: "center",
                        colSpan: 2,
                    },
                    {},
                ];
            } catch (err) {
                console.error("Erro ao processar imagem:", err.message);
                return [
                    { text: "Erro ao carregar imagem", colSpan: 2, alignment: "center", fontSize: 10 },
                    {},
                ];
            }
        })
    );

    return rows;
};

module.exports = {
    buildLI: async (empresa, servicoId, gesIds, cliente) => {
        const servicoToDocBase = await getDadosServicoByEmpresaServicoToDocbase(empresa.dataValues.id, servicoId);

        const responsaveisTecnicos = servicoToDocBase.dataValues.responsavelTecnicoServicos.map((item) => {
            return item.dataValues.responsavelTecnico.dataValues;
        });

        const body = [];

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

                return {
                    ...response,
                };
            })
        );

        let gesGeneralETrabalhadores = gesData.map((item) => {
            console.log(item.dataValues.trabalhadores.trabalhadores[0].dataValues.trabalhador.dataValues)
            return {
                ges: {
                    id: item.dataValues.id,
                    descricao: item.dataValues,
                    ambienteDeTrabalho: item.dataValues.ambientesTrabalhos.ambientesTrabalhos,
                    imagens: item.dataValues.imagens.imagens,
                    riscos: item.dataValues.riscos.riscos.map((risco) => ({
                        id: risco.dataValues.id,
                        intensConc: risco.dataValues.intens_conc,
                        ltLe: risco.dataValues.lt_le,
                        comentario: risco.dataValues.comentario,
                        nivelAcao: risco.dataValues.nivel_acao,
                        desvioPadrao: risco.dataValues.desvio_padrao,
                        percentil: risco.dataValues.percentil,
                        probabFreq: risco.dataValues.probab_freq,
                        conseqSeveridade: risco.dataValues.conseq_severidade,
                        grauRisco: risco.dataValues.grau_risco,
                        classeRisco: risco.dataValues.classe_risco,
                        conclusaoLtcat: risco.dataValues.conclusao_ltcat,
                        conclusaoPericulosidade: risco.dataValues.conclusao_periculosidade,
                        conclusaoInsalubridade: risco.dataValues.conclusao_insalubridade,
                        fatorRisco: risco.dataValues.fatorRisco?.dataValues,
                        fonteGeradora: risco.dataValues.fonteGeradora?.dataValues,
                        tecnicaUtilizada: risco.dataValues.tecnicaUtilizada?.dataValues,
                        exposicao: risco.dataValues.exposicao?.dataValues,
                        meioPropagacao: risco.dataValues.meioPropagacao?.dataValues,
                        trajetoria: risco.dataValues.trajetoria?.dataValues,
                        relacoesAdministrativas: risco.dataValues.relacoes_administrativas?.map(r => r.dataValues) || [],
                        relacoesColetivas: risco.dataValues.relacoes_coletivas?.map(r => r.dataValues) || [],
                        relacoesIndividuais: risco.dataValues.relacoes_individuais?.map(r => r.dataValues) || [],
                        planosAcao: risco.dataValues.planosAcao || [],
                        imagensFichaCampo: risco.dataValues.imagensFichaCampo || [],
                        imagensFotoAvaliacao: risco.dataValues.imagensFotoAvaliacao || [],
                        imagensHistogramas: risco.dataValues.imagensHistogramas || [],
                        imagensMemorialCalculo: risco.dataValues.imagensMemorialCalculo || []
                    })),
                },
                trabalhadores: item.dataValues.trabalhadores.trabalhadores
                    .map((trabalhador) => ({
                        id: trabalhador.dataValues.trabalhador.dataValues.id,
                        setor: trabalhador.dataValues.trabalhador.dataValues.setor.dataValues.descricao,
                        funcao: trabalhador.dataValues.trabalhador.dataValues.funcao.dataValues.funcao,
                        descricaoFuncao: trabalhador.dataValues.trabalhador.dataValues.funcao.dataValues.descricao,
                        nome: trabalhador.dataValues.trabalhador.dataValues.nome,
                        tempoExposicao: trabalhador.dataValues.trabalhador.jornada_trabalho
                    }))
                    .sort((a, b) => {
                        const setorCompare = a.setor.localeCompare(b.setor, 'pt-BR', { sensitivity: 'base' });
                        if (setorCompare !== 0) return setorCompare;

                        return a.funcao.localeCompare(b.funcao, 'pt-BR', { sensitivity: 'base' });
                    })
            };
        });


        const responsaveis = await getResponsavelByServico(empresa.id, servicoId);

        if (responsaveis) {
            // junta todos os arrays que vierem
            const todos = responsaveis.dataValues.responsavelTecnicoServicos
                .map(item => item.dataValues.responsavelTecnico.dataValues)
                .flat();

            // remove duplicados pelo nome (pode trocar a chave se precisar)
            const unicos = [
                ...new Map(todos.map(item => [item.nome, item])).values()
            ];

            gesGeneralETrabalhadores["responsaveis"] = unicos;
        }

        const servico = await getDadosServicoByEmpresaServico(empresa.id, servicoId);
        if (servico) {
            const formatar = (data) => {
                if (!data) return '';
                const [ano, mes, dia] = data.split('-');
                return `${dia}/${mes}/${ano}`;
            };
            gesGeneralETrabalhadores["servico"] = {
                dataInicio: formatar(servico.dataValues.data_inicio),
                dataFim: formatar(servico.dataValues.data_fim)
            };
        }

        body.push({
            table: {
                widths: ["50%", "50%"],
                body: [
                    [
                        {
                            text: [
                                {
                                    text: 'Título: ',
                                    fontSize: 10,
                                    bold: true
                                },
                                {
                                    text: 'Laudo Técnico de Periculosidade',
                                    fontSize: 10,
                                    bold: false
                                }
                            ],
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 2
                        },
                        {}
                    ],
                    [
                        {
                            text: [
                                {
                                    text: 'Elaborado por: ',
                                    fontSize: 10,
                                    bold: true
                                },
                                {
                                    text: empresa.dataValues.nome,
                                    fontSize: 10,
                                    bold: false
                                }
                            ],
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 2
                        },
                        {}
                    ],
                    [
                        {
                            text: 'IDENTIFICAÇÃO GERAL',
                            fontSize: 10,
                            bold: true,
                            colSpan: 2,
                            alignment: 'center',
                            fillColor: "#D9D9D9",
                            lineHeight: 1
                        },
                        {}
                    ],
                    [
                        {
                            text: {
                                text: responsaveisTecnicos.length > 1 ? 'Responsáveis Técnicos: ' : 'Responsável Técnico: ',
                                fontSize: 10,
                                bold: true
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        },
                        {
                            text: {
                                text: 'Data do Laudo: ',
                                fontSize: 10,
                                bold: true
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        }
                    ],
                    [
                        {
                            stack: responsaveisTecnicos.flatMap(e => {
                                const bloco = [];
                                if (e.nome && e.funcao) {
                                    if (e.numero_crea && e.estado_crea) {
                                        bloco.push(
                                            {
                                                text: "• " + e.funcao + " " + e.nome + " " + "CREA-" + e.estado_crea + ": " + e.numero_crea,
                                                fontSize: 10,
                                                alignment: "justify",
                                                lineHeight: 1
                                            }
                                        );
                                    } else {
                                        bloco.push(
                                            {
                                                text: "• " + e.funcao + " " + e.nome,
                                                fontSize: 10,
                                                alignment: "justify",
                                                lineHeight: 1
                                            }
                                        );
                                    }
                                }
                                return bloco;
                            }),
                            colSpan: 1
                        },
                        {
                            text: new Date().toLocaleDateString("pt-BR"),
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        }
                    ],
                    [
                        {
                            text: {
                                text: 'Empresa:',
                                fontSize: 10,
                                bold: true
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        },
                        {
                            text: {
                                text: 'CNPJ:',
                                fontSize: 10,
                                bold: true
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        }
                    ],
                    [
                        {
                            text: {
                                text: empresa.dataValues.nome,
                                fontSize: 10,
                                bold: false
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        },
                        {
                            text: {
                                text: empresa.dataValues.cnpj,
                                fontSize: 10,
                                bold: false
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 1
                        }
                    ],
                    [
                        {
                            text: {
                                text: 'Endereço:',
                                fontSize: 10,
                                bold: true
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 2
                        },
                        {}
                    ],
                    [
                        {
                            text: {
                                text: empresa.dataValues.endereco,
                                fontSize: 10,
                                bold: false
                            },
                            alignment: 'left',
                            lineHeight: 1,
                            colSpan: 2
                        },
                        {}
                    ],
                ],
            },
            layout: {
                hLineWidth: function () { return 0.5; },
                vLineWidth: function () { return 0.5; },
            }
        });

        const gesAgrupados = {};
        gesGeneralETrabalhadores.forEach(e => {
            const gesId = e.ges.id;
            if (!gesAgrupados[gesId]) {
                gesAgrupados[gesId] = e;
            }
        });

        const values = Object.values(gesAgrupados);

        for (let index = 0; index < values.length; index++) {
            const e = values[index];

            const ambiente = e.ges.descricao.ambientesTrabalhos?.ambientesTrabalhos?.[0]?.dataValues;

            const equipamentosUnicos = [
                ...new Set(
                    ambiente.EquipamentoAmbienteTrabalho?.map(eq => eq.dataValues.equipamento.dataValues.desc) || []
                )
            ];

            const mobiliariossUnicos = [
                ...new Set(
                    ambiente.MobiliarioAmbienteTrabalho?.map(eq => eq.dataValues.mobiliario.dataValues.descri) || []
                )
            ];

            const imagens = [
                ...new Set(
                    e.ges.imagens?.map(img => img.dataValues) || []
                )
            ];

            const imageRows = await getImages(imagens);

            const imageTableBody = imageRows.length > 0
                ? imageRows
                : [[{ text: "Nenhuma imagem disponível", colSpan: 2, alignment: "center", fontSize: 10 }, {}]];

            body.push({
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            {
                                text: [
                                    {
                                        text: 'GHE/GES: ',
                                        fontSize: 10,
                                        bold: true
                                    },
                                    {
                                        text: `${e.ges.descricao.codigo} - ${e.ges.descricao.descricao_ges}`,
                                        fontSize: 10,
                                        bold: false
                                    }
                                ],
                                fontSize: 10,
                                bold: true,
                                colSpan: 2,
                                lineHeight: 1
                            },
                            {}
                        ],
                        [
                            {
                                text: '1. OBJETIVO',
                                fontSize: 10,
                                bold: true,
                                colSpan: 2,
                                alignment: 'left',
                                fillColor: "#D9D9D9",
                                lineHeight: 1
                            },
                            {}
                        ],
                        [
                            {
                                text: 'Este laudo tem o objetivo de verificar coletivamente as condições ambientais de trabalho conforme NR-15 da Portaria 3214/78 do Ministério do Trabalho para fins de pagamento de adicional de insalubridade.\n Foi avaliado o local de trabalho com o objetivo de atestar as condições ambientais nas atividades desenvolvidas.',
                                fontSize: 10,
                                bold: false,
                                colSpan: 2,
                                alignment: 'justify',
                                lineHeight: 1
                            },
                            {}
                        ],
                        [
                            {
                                text: '2. ANÁLISE SETOR E FUNÇÃO',
                                fontSize: 10,
                                bold: true,
                                colSpan: 2,
                                alignment: 'left',
                                fillColor: "#D9D9D9",
                                lineHeight: 1
                            },
                            {}
                        ],
                        [
                            {
                                text: {
                                    text: 'REGISTRO DE ATIVIDADES EXECUTADAS',
                                    fontSize: 10,
                                    bold: true
                                },
                                alignment: 'center',
                                lineHeight: 1,
                                colSpan: 2
                            },
                            {}
                        ],
                        ...e.trabalhadores.flatMap(trabalhador => [
                            [
                                {
                                    text: `${trabalhador.setor || 'Setor não informado.'} - ${trabalhador.funcao || 'Função não informada.'}`,
                                    fontSize: 10,
                                    bold: true,
                                    colSpan: 2,
                                    alignment: 'left',
                                    lineHeight: 1
                                },
                                {}
                            ],
                            [
                                {
                                    text: `${trabalhador.descricaoFuncao || 'Descrição da função não informada.'}`,
                                    fontSize: 10,
                                    bold: false,
                                    colSpan: 2,
                                    alignment: 'justify',
                                    lineHeight: 1
                                },
                                {}
                            ]
                        ]),
                        [
                            {
                                text: {
                                    text: 'DESCRIÇÃO DO LOCAL DE TRABALHO',
                                    fontSize: 10,
                                    bold: true
                                },
                                alignment: 'center',
                                lineHeight: 1,
                                colSpan: 2
                            },
                            {}
                        ],
                        ...(ambiente ? [
                            [
                                { text: `Área: ${ambiente.area || 'Não aplicavel'} m²`, fontSize: 10, lineHeight: 1, colSpan: 1 },
                                { text: `Pé-direito: ${ambiente.pe_direito + "m" || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 }
                            ],
                            [
                                { text: `Nº de janelas: ${ambiente.qnt_janelas || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 },
                                { text: `Nº de equipamentos: ${ambiente.qnt_equipamentos ?? 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 }
                            ],
                            [
                                { text: `Tipo de edificação: ${ambiente.edificacao?.dataValues?.descricao || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 },
                                { text: `Teto: ${ambiente.teto?.dataValues?.descricao || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 }
                            ],
                            [
                                { text: `Parede: ${ambiente.parede?.dataValues?.descricao || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 },
                                { text: `Piso: ${ambiente.piso?.dataValues?.descricao || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 }
                            ],
                            [
                                { text: `Ventilação: ${ambiente.ventilacao?.dataValues?.descricao || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 },
                                { text: `Iluminação: ${ambiente.iluminacao?.dataValues?.descricao || 'Não aplicavel'}`, fontSize: 10, lineHeight: 1, colSpan: 1 }
                            ],
                            [
                                { text: `Informações adicionais: ${ambiente.informacoes_adicionais || 'Não aplicavel'}`, fontSize: 10, colSpan: 2, lineHeight: 1 },
                                {}
                            ],
                            [
                                {
                                    text: equipamentosUnicos.length
                                        ? `Equipamentos: ${equipamentosUnicos.join('; ')}`
                                        : "Nenhum equipamento informado",
                                    fontSize: 10,
                                    colSpan: 2,
                                    lineHeight: 1
                                },
                                {}
                            ],
                            [
                                {
                                    text: mobiliariossUnicos.length
                                        ? `Mobiliários: ${mobiliariossUnicos.join('; ')}`
                                        : "Nenhum mobiliario informado",
                                    fontSize: 10,
                                    colSpan: 2,
                                    lineHeight: 1
                                },
                                {}
                            ],
                        ] : [[{ text: "Ambiente não informado", fontSize: 10, colSpan: 2 }, {}]]),
                        ...imageTableBody,



                    ]
                },
                layout: {
                    hLineWidth: function () { return 0.5; },
                    vLineWidth: function () { return 0.5; },
                },
            });

            e.ges?.riscos.map(async risco => {
                body.push(
                    [
                        {
                            table: {
                                widths: ['50%', '50%'],
                                body: [
                                    [
                                        {
                                            text: '3. IDENTIFICAÇÃO DE AGENTE NOCIVO CAPAZ DE CAUSAR DANO À SAÚDE E INTEGRIDADE FÍSICA, ARROLADO NA LEGISLAÇÃO TRABALHISTA',
                                            fontSize: 10,
                                            bold: true,
                                            colSpan: 2,
                                            alignment: 'left',
                                            fillColor: "#D9D9D9",
                                            lineHeight: 1
                                        },
                                        {}
                                    ],
                                    [
                                        {
                                            text: 'Risco: ',
                                            fontSize: 10,
                                            alignment: 'justify',
                                            bold: true,
                                            lineHeight: 1,
                                            color: "white",
                                            fillColor: "#000000"
                                        },
                                        {
                                            text: 'Agente nocivo: ',
                                            fontSize: 10,
                                            alignment: 'justify',
                                            bold: true,
                                            lineHeight: 1,
                                            color: "white",
                                            fillColor: "#000000"
                                        }
                                    ],
                                    [
                                        {
                                            text: risco?.fatorRisco.tipo,
                                            fontSize: 10,
                                            alignment: 'center',
                                            bold: true,
                                            lineHeight: 1,
                                            color: "white",
                                            fillColor: "#000000"
                                        },
                                        {
                                            text: risco?.fatorRisco.descricao,
                                            fontSize: 10,
                                            alignment: 'center',
                                            bold: true,
                                            lineHeight: 1,
                                            color: "white",
                                            fillColor: "#000000"
                                        }
                                    ]
                                ]
                            },
                            layout: 'centerLTCATVertically',
                            colSpan: 5,
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
                                            bold: true,
                                            lineHeight: 1
                                        },
                                        {
                                            text: 'Via e periodicidade de exposição ao agente nocivo:',
                                            fontSize: 10,
                                            alignment: 'justify',
                                            bold: true,
                                            lineHeight: 1
                                        }
                                    ]
                                ]
                            },
                            layout: 'centerLTCATVertically',
                            colSpan: 5,
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
                                            text: `${risco.fonteGeradora?.descricao || "Não aplicavel"}`,
                                            fontSize: 10,
                                            alignment: 'justify',
                                            bold: true,
                                            lineHeight: 1
                                        },
                                        {
                                            text: `Exposição: ${risco.exposicao.descricao}; Meio de Propagação: ${risco.meioPropagacao.descricao}; Trajetória: ${risco.trajetoria.descricao}`,
                                            fontSize: 10,
                                            alignment: 'justify',

                                            bold: true,
                                            lineHeight: 1
                                        }
                                    ]
                                ]
                            },
                            layout: 'centerLTCATVertically',
                            colSpan: 5,
                            lineHeight: 0.5
                        },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: "CRITÉRIO DE AVALIAÇÃO", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: risco?.tecnicaUtilizada.descricao, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 5 },
                        {}, {}, {}, {}
                    ]
                );

                if (risco?.fatorRisco.parametro == "Quantitativo") {
                    body.push([
                        {
                            table: {
                                widths: ['20%', '20%', '20%', '20%', '20%'],
                                body: [
                                    [
                                        { text: "INTERPRETAÇÃO DOS RESULTADOS", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
                                        {}, {}, {}, {}
                                    ],
                                    [
                                        { text: "Medida Geométrica (MG) / Intens. / Conc.", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                        { text: "Desvio Padrão Geométrico (DPG)", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                        { text: "Percentil 95", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                        { text: "LT / LE", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                        { text: "Nível de Ação", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 }
                                    ],
                                    [
                                        { text: `${risco?.intensConc}`, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                        { text: `${risco?.desvioPadrao}`, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                        { text: `${risco?.percentil}`, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                        { text: `${risco?.ltLe}`, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 },
                                        { text: `${risco?.nivelAcao}`, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 1 }
                                    ],
                                    [
                                        { text: "Consultar anexos para verificação (dados do equipamento, data calibração, aferição inicial e final, data, trabalhador amostrado, intes. / conc. e Tempo de exposição)", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
                                        {}, {}, {}, {}
                                    ],
                                    [
                                        { text: "LE - Limite de Exposição conforme NR-15 ou Legislação Internacional; LT - Limite de Tolerância conforme NR-15; NA - Nível de Ação conforme NR-9", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
                                        {}, {}, {}, {}
                                    ],
                                    [
                                        { text: "REGISTRO DE CONDIÇÕES ANORMAIS", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 4 },
                                        {}, {}, {},
                                        { text: "DADOS CONFIÁVEIS", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 }
                                    ],
                                    [
                                        {
                                            text: "Nenhuma condição não conforme encontrada durante o planejamento, preparativos e calibração. Nenhuma interferência detectada e nenhuma objeção do trabalhador.",
                                            fontSize: 10,
                                            alignment: "center",

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
                                                        { text: "Sim", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 },
                                                        { text: "Não", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 }
                                                    ],
                                                    [
                                                        { text: "X", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 },
                                                        { text: "", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 }
                                                    ]
                                                ]
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
                                            colSpan: 1
                                        }
                                    ]
                                ]
                            }
                        }
                    ]

                    );
                }

                const medidasColetivas = risco.relacoesColetivas?.map(relacao => relacao.medidas_coletivas_existentes?.dataValues?.descrica).filter(Boolean).join("; ");
                const medidasAdministrativas = risco.relacoesAdministrativas?.map(relacao => relacao.medidas_administrativas_existen).filter(Boolean).join("; ");
                const medidasIndividuais = risco.relacoesIndividuais?.map(relacao => relacao.medidas_individuais_existentes?.dataValues?.desc).filter(Boolean).join("; ");

                // MEDIDAS DE CONTROLE EXISTENTES
                if (medidasColetivas || medidasAdministrativas || medidasIndividuais) {
                    body.push(
                        [
                            { text: "MEDIDAS DE CONTROLE", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
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

                                lineHeight: 1,
                                colSpan: 5
                            },
                            {}, {}, {}, {}
                        ]
                    );
                }

                // MEDIDAS A SEREM IMPLANTADAS
                const medidasColetivasNec = (risco.planosAcao?.flatMap(plano =>
                    plano.riscosColetivosNecessaria?.flatMap(m => m.medidas_coletivas_n || [])
                ) || []).filter(Boolean).join("; ");

                const medidasAdministrativasNec = (risco.planosAcao?.flatMap(plano =>
                    plano.riscosAdministrativosNecessaria?.flatMap(m => m.medidas_admin || [])
                ) || []).filter(Boolean).join("; ");

                const medidasIndividuaisNec = (risco.planosAcao?.flatMap(plano =>
                    plano.riscosIndividuaisNecessaria?.flatMap(m => m.medidas_individua || [])
                ) || []).filter(Boolean).join("; ");

                if (medidasColetivasNec || medidasAdministrativasNec || medidasIndividuaisNec) {
                    body.push(
                        [
                            { text: "MEDIDAS DE CONTROLE A SEREM IMPLANTADAS", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
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

                                lineHeight: 1,
                                colSpan: 5
                            },
                            {}, {}, {}, {}
                        ]
                    );
                }


                body.push([
                    {
                        table: {
                            widths: ["*", "*", "*", "*", "*"],
                            body: [
                                [
                                    { text: "ANÁLISE FINAL DO GES", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "VERIFICAÇÕES REALIZADAS", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: "Tópico", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Pontos de Verificação", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                                [
                                    { text: "Planejamento e Preparativos", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Integridade eletromecânica do aparelho, baterias, laudo de calibração RBC Inmetro, aferidores (se aplicável) e folha de campo.", fontSize: 10, alignment: "justify", bold: false, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                                [
                                    { text: "Aferição", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Prevista aferição do aparelho antes e depois da avaliação, em local adequado. A avaliação foi invalidada se a aferição acusar variação fora da faixa tolerada pelas normas de higiene ocupacional da Fundacentro e/ou se a bateria estiver abaixo do nível aceitável.", fontSize: 10, alignment: "justify", bold: false, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                                [
                                    { text: "Posicionamento", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Posicionamento do aparelho para avaliação conforme normas de higiene ocupacional da Fundacentro.", fontSize: 10, alignment: "justify", bold: false, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                                [
                                    { text: "Interferência", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Não foi permitido o uso de rádio ou outras influências eletromagnéticas, chuva, umidade e calor excessivo.", fontSize: 10, alignment: "justify", bold: false, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                                [
                                    { text: "Informar o trabalhador", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Foi informado objetivo do trabalho: avaliação não deve interferir em suas atividades habituais; o aparelho não efetua gravação de conversas; o aparelho só deve ser removido pelo avaliador; aparelho não pode ser tocado ou obstruído.", fontSize: 10, alignment: "justify", bold: false, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                                [
                                    { text: "Projeção da avaliação", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 1 },
                                    { text: "Foi utilizada a projeção da avaliação: \na) pelo conhecimento das atividades e do processo, e pelo acompanhamento feito durante a amostragem, que o período não amostrado é essencialmente igual ao amostrado do ponto de vista da exposição ao agente.\n b) pelas mesmas razões supracitadas, que a exposição ocupacional no período não amostrado, foi nula (exposição zero). Anexo a este laudo encontra-se o histograma ou relatório de ensaio.", fontSize: 10, alignment: "justify", bold: false, lineHeight: 1, colSpan: 4 },
                                    {}, {}, {}
                                ],
                            ]
                        }
                    }
                ]);

                body.push({
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [
                                {
                                    text: "5. CONCLUSÃO FINAL", fontSize: 10,
                                    bold: true,
                                    alignment: 'left',
                                    fillColor: "#D9D9D9",
                                    lineHeight: 1,
                                    margin: [5, 0],
                                    colSpan: 2
                                },
                                {}
                            ],
                            [
                                {
                                    text: risco?.conclusaoPericulosidade || "N/A",
                                    bold: false,
                                    alignment: 'left',
                                    lineHeight: 1,
                                    margin: [5, 0],
                                    colSpan: 2
                                },
                                {}
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function () { return 0.5; },
                        vLineWidth: function () { return 0.5; },
                    },
                });
            });



        }

        body.push(
            gesGeneralETrabalhadores.responsaveis.map((responsavel) => [
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [
                                {
                                    text: [
                                        {
                                            text: "Assinatura do " + responsavel.funcao + " " + responsavel.nome
                                        },
                                        responsavel.numero_crea && responsavel.estado_crea ? {
                                            text: ` ( CREA-${responsavel.estado_crea}/${responsavel.numero_crea} )`
                                        } : {}
                                    ],
                                    fontSize: 10,
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: "#D9D9D9",
                                    lineHeight: 1,
                                    margin: [5, 0],
                                },
                            ],
                            [
                                {
                                    text: `${gesGeneralETrabalhadores.servico.dataInicio || "N/A"} - ${gesGeneralETrabalhadores.servico.dataFim || "N/A"}`,
                                    bold: false,
                                    alignment: 'left',
                                    lineHeight: 10,
                                    margin: [5, 0],
                                },
                            ]
                        ]
                    }
                }
            ])
        )

        return {
            body
        };
    }
};