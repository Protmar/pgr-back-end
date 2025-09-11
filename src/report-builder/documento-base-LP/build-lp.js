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
const { all } = require('axios');
const { table } = require('console');

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
    buildLP: async (empresa, servicoId, gesIds, cliente) => {
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
                        descricaoFuncao: trabalhador.dataValues.trabalhador.dataValues.funcao.dataValues.descricao
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



        const gesAgrupados = {};
        gesGeneralETrabalhadores.forEach(e => {
            const gesId = e.ges.id;
            if (!gesAgrupados[gesId]) {
                gesAgrupados[gesId] = e;
            }
        });

        const values = Object.values(gesAgrupados);
        const allConclusao = [];


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

            const trabalhadoresUnicos = [
                ...new Map(
                    e.trabalhadores.map(trab => [
                        `${trab.setor || 'Setor não aplicavel.'} - ${trab.funcao || 'Função não informada.'}`,
                        trab
                    ])
                ).values()
            ];

            body.push({
                table: {
                    widths: ["50%", "50%"],
                    body: [
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
                                colSpan: 1,
                                bold: false,
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
                                    text: cliente.dataValues.nome_fantasia,
                                    fontSize: 10,
                                    bold: false
                                },
                                alignment: 'left',
                                lineHeight: 1,
                                colSpan: 1
                            },
                            {
                                text: {
                                    text: cliente.dataValues.cnpj,
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
                                    text: cliente.dataValues.localizacao_completa,
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

            body.push({
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            {
                                text: [
                                    {
                                        text: 'GES: ',
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
                                text: 'Este laudo tem o objetivo de verificar coletivamente as condições ambientais de trabalho conforme NR-16 da Portaria 3214/78 do Ministério do Trabalho para fins de pagamento de adicional de periculosidade O art. 193 da Consolidação das Leis do Trabalho - CLT, aprovada pelo Decreto- Lei nº 5.452, de 1º de maio de 1943 prevê que são consideradas atividades ou operações perigosas, na forma da regulamentação aprovada pelo Ministério do Trabalho e Emprego, aquelas que, por sua natureza ou métodos de trabalho, impliquem risco acentuado em virtude de exposição permanente do trabalhador. São elas:  \na) ATIVIDADES E OPERAÇÕES PERIGOSAS COM EXPLOSIVOS  \nb) ATIVIDADES E OPERAÇÕES PERIGOSAS COM INFLAMÁVEIS  \nc) ATIVIDADES E OPERAÇÕES PERIGOSAS COM EXPOSIÇÃO A ROUBOS OU OUTRAS ESPÉCIES DE VIOLÊNCIA FÍSICA NAS ATIVIDADES PROFISSIONAIS DE SEGURANÇA PESSOAL OU PATRIMONIAL  \nd) ATIVIDADES E OPERAÇÕES PERIGOSAS COM ENERGIA ELÉTRICA  \ne) ATIVIDADES E OPERAÇÕES PERIGOSAS COM RADIAÇÕES IONIZANTES OU SUBSTÂNCIAS RADIOTIVAS  \nf) ATIVIDADES PERIGOSAS EM MOTOCICLETAS \nFoi avaliado o local de trabalho com o objetivo de atestar as condições ambientais nas atividades desenvolvidas.',
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
                        ...trabalhadoresUnicos.flatMap(trabalhador => [
                            [
                                {
                                    text: `${trabalhador.setor || 'Setor não aplicavel.'} - ${trabalhador.funcao || 'Função não informada.'}`,
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
                                { text: `Área: ${ambiente.area || 'Não aplicavel'} ${ambiente.area ? 'm2' : ''}`, fontSize: 10, lineHeight: 1, colSpan: 1 },
                                { text: `Pé-direito: ${ambiente.pe_direito || 'Não aplicavel'} ${ambiente.pe_direito ? 'm' : ''}`, fontSize: 10, lineHeight: 1, colSpan: 1 }
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
                        ] : [[{ text: "Ambiente não aplicavel", fontSize: 10, colSpan: 2 }, {}]]),
                        imageTableBody && [
                            {
                                text: {
                                    text: 'IMAGENS DO LOCAL DE TRABALHO',
                                    fontSize: 10,
                                    bold: true
                                },
                                alignment: 'center',
                                lineHeight: 1,
                                colSpan: 2
                            },
                            {}
                        ],
                        ...imageTableBody,
                    ]
                },
                layout: {
                    hLineWidth: function () { return 0.5; },
                    vLineWidth: function () { return 0.5; },
                },
            });

            e.ges?.riscos?.length > 0 && body.push(
                [
                    {
                        table: {
                            widths: ['100%'],
                            body: [
                                [
                                    {
                                        text: '3. IDENTIFICAÇÃO DE ATIVIDADES PERICULOSAS CONFORME NR-16 DA PORTARIA 3214/78 DO MINISTÉRIO DO TRABALHO',
                                        fontSize: 10,
                                        bold: true,
                                        alignment: 'left',
                                        fillColor: "#D9D9D9",
                                        lineHeight: 1
                                    },
                                ],
                            ]
                        },
                        layout: 'centerLTCATVertically',
                        colSpan: 5,
                        lineHeight: 0.5
                    }, {}, {}, {}, {}
                ]
            )

            const ordemTipo = ["Físico", "Químico", "Biológico", "Mecânico", "Ergonômico"];

            const riscosOrdenados = (e.ges?.riscos || []).sort((a, b) => {
                const posA = ordemTipo.indexOf(a?.fatorRisco?.tipo) ?? Number.MAX_SAFE_INTEGER;
                const posB = ordemTipo.indexOf(b?.fatorRisco?.tipo) ?? Number.MAX_SAFE_INTEGER;

                if (posA !== posB) {
                    return posA - posB; // ordena pelo tipo
                }

                return (a?.fatorRisco?.ordem ?? 0) - (b?.fatorRisco?.ordem ?? 0); // ordena dentro do tipo
            });

            riscosOrdenados.map(async risco => {
                if (!risco?.fatorRisco.laudo_periculosidade) return
                allConclusao.push(risco?.conclusaoPericulosidade || null);

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
                                    ],
                                    [
                                        { text: "CRITÉRIO DE AVALIAÇÃO", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 2 },
                                        {}
                                    ],
                                    [
                                        { text: risco?.tecnicaUtilizada.descricao, fontSize: 10, alignment: "center", bold: false, lineHeight: 1, colSpan: 2 },
                                        {}
                                    ],
                                    [
                                        { text: "MEDIDAS DE CONTROLE EXISTENTES", fontSize: 10, alignment: "center", bold: true, lineHeight: 1, colSpan: 2 },
                                        {}
                                    ]
                                ]
                            },
                            layout: 'centerLTCATVertically',
                            colSpan: 5,
                            lineHeight: 0.5
                        },
                        {}, {}, {}, {}
                    ],

                );



                const medidasColetivas = risco.relacoesColetivas?.map(relacao => relacao.medidas_coletivas_existentes?.dataValues?.descrica).filter(Boolean).join("; ");
                const medidasAdministrativas = risco.relacoesAdministrativas?.map(relacao => relacao.medidas_administrativas_existen).filter(Boolean).join("; ");
                const medidasIndividuais = risco.relacoesIndividuais?.map(relacao => relacao.medidas_individuais_existentes?.dataValues?.desc).filter(Boolean).join("; ");

                // MEDIDAS DE CONTROLE EXISTENTES
                if (medidasColetivas || medidasAdministrativas || medidasIndividuais) {
                    body.push(
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
                                colSpan: 5,
                                margin: [5, 0, 5, 0]
                            },
                            {}, {}, {}, {}
                        ]
                    );
                }

                risco.planosAcao?.forEach(plano => {
                    plano.dataValues.riscosColetivosNecessaria =
                        (plano.dataValues.riscosColetivosNecessaria || []).map(rp => rp.dataValues || rp);

                    plano.dataValues.riscosAdministrativosNecessaria =
                        (plano.dataValues.riscosAdministrativosNecessaria || []).map(rp => rp.dataValues || rp);

                    plano.dataValues.riscosIndividuaisNecessaria =
                        (plano.dataValues.riscosIndividuaisNecessaria || []).map(rp => rp.dataValues || rp);

                });


                // MEDIDAS A SEREM IMPLANTADAS
                const medidasColetivasNec = (risco.planosAcao?.flatMap(plano =>
                    plano.dataValues.riscosColetivosNecessaria?.flatMap(m => m.medidas_coletivas_n || [])
                ) || []).filter(Boolean).join("; ");

                const medidasAdministrativasNec = (risco.planosAcao?.flatMap(plano =>
                    plano.dataValues.riscosAdministrativosNecessaria?.flatMap(m => m.medidas_admin || [])
                ) || []).filter(Boolean).join("; ");

                const medidasIndividuaisNec = (risco.planosAcao?.flatMap(plano =>
                    plano.dataValues.riscosIndividuaisNecessaria?.flatMap(m => m.medidas_individua || [])
                ) || []).filter(Boolean).join("; ");

                if (medidasColetivasNec || medidasAdministrativasNec || medidasIndividuaisNec) {
                    body.push({
                        table: {
                            widths: ['100%'],
                            body: [
                                [
                                    { text: "MEDIDAS DE CONTROLE NECESSÁRIAS", fontSize: 10, alignment: "center", bold: true, lineHeight: 1 },

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
                                    },

                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function () { return 0.5; },
                            vLineWidth: function () { return 0.5; },
                        },
                    }, {}, {}, {}, {});
                }

                body.push({
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [
                                {
                                    text: "CONCLUSÃO DO RISCO", fontSize: 10,
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
                                    text: risco?.conclusaoPericulosidade || "Não aplicavel",
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

            body.push({ text: "", pageBreak: "before" });

        }

        body.push(
            {
                table: {
                    widths: ['100%'],
                    body: [
                        [
                            {
                                text: '4. CONCLUSÃO FINAL',
                                fontSize: 10,
                                bold: true,
                                alignment: 'left',
                                fillColor: "#D9D9D9",
                                lineHeight: 1
                            },
                        ],
                        [
                            {
                                text: allConclusao.map((conclusao) => conclusao !== null ? conclusao + "\n\n" : "") || "",
                                fontSize: 10,
                                alignment: 'left',
                                lineHeight: 1,
                                margin: [5, 0],
                            },
                        ],
                        [
                            {
                                text: '5. ASSINATURAS',
                                fontSize: 10,
                                bold: true,
                                alignment: 'left',
                                fillColor: "#D9D9D9",
                                lineHeight: 1
                            },
                        ],
                    ]
                }
            }
        )

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
                                    text: `${gesGeneralETrabalhadores.servico.dataInicio || "Não aplicavel"}`,
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