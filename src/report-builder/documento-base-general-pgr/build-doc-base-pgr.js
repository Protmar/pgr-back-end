const { getAllGesByServico, getOneGesService, getEpisInString } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");
const { getResponsavelByServico, getDadosServicoByEmpresaServico, getDadosServicoByEmpresaServicoToDocbase } = require("../../services/servicos");
const { getDataDadosEstatisticosByOneLaudoType } = require("../../services/servicos/dadosEstatisticos");
const { ConnectContactLens } = require("aws-sdk");
const { text } = require("body-parser");
const { matrizPadraoGetAllDocBase } = require("../../services/cadastros/matrizpadrao/matrizpadrao");

module.exports = {

    buildDocBasePgr: async (empresa, servicoId, cliente) => {
        try {

            const allMatriz = await matrizPadraoGetAllDocBase(
                empresa.dataValues.id,
                servicoId
            );

            let matrizAgrupada = {};

            // --- Agrupa os dados por matriz_id e salva apenas os campos essenciais ---
            Object.values(allMatriz).forEach(({ data }) => {
                data.forEach((item) => {
                    const matrizId = item.dataValues?.id || item.id;

                    if (!matrizAgrupada[matrizId]) {
                        const { size, tipo, parametro, is_padrao } = item.dataValues ?? {};

                        matrizAgrupada[matrizId] = {
                            matriz_id: matrizId,
                            info: { size, tipo, parametro, is_padrao },
                            probabilidadesMatriz: [],
                            severidadesMatriz: [],
                            classificacaoRiscoMatriz: []
                        };
                    }

                    if (item.probabilidades) {
                        matrizAgrupada[matrizId].probabilidadesMatriz.push(
                            ...item.probabilidades.map((p) => p.dataValues ?? p)
                        );
                    }

                    if (item.severidades) {
                        matrizAgrupada[matrizId].severidadesMatriz.push(
                            ...item.severidades.map((s) => s.dataValues ?? s)
                        );
                    }

                    if (item.classificacaoRisco) {
                        matrizAgrupada[matrizId].classificacaoRiscoMatriz.push(
                            ...item.classificacaoRisco.map((c) => c.dataValues ?? c)
                        );
                    }

                });
            });

            // transforma em array
            const resultadoFinal = Object.values(matrizAgrupada);

            // ordem fixa dos tipos e parâmetros
            const ordemTipos = ["Físico", "Químico", "Biológico", "Mecânico", "Ergonômico"];
            const ordemParametros = ["Quantitativo", "Qualitativo"];

            // função para ordenar
            function ordenarMatrizes(matrizA, matrizB) {
                const tipoA = ordemTipos.indexOf(matrizA.info.tipo) ?? 999;
                const tipoB = ordemTipos.indexOf(matrizB.info.tipo) ?? 999;

                if (tipoA !== tipoB) return tipoA - tipoB;

                const paramA = ordemParametros.indexOf(matrizA.info.parametro) ?? 999;
                const paramB = ordemParametros.indexOf(matrizB.info.parametro) ?? 999;

                return paramA - paramB;
            }

            // aplica a ordenação
            const resultadoOrdenado = resultadoFinal.sort(ordenarMatrizes);

            const pdfMatrizBlocks = resultadoOrdenado.map((matriz) => {
                if (!matriz.probabilidadesMatriz.length || !matriz.severidadesMatriz.length) return null;

                // Ordena eixos e classificação
                matriz.severidadesMatriz.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
                matriz.probabilidadesMatriz.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
                matriz.classificacaoRiscoMatriz.sort((a, b) => (a.valor ?? 0) - (b.valor ?? 0));

                const headerRow = [""].concat(
                    matriz.probabilidadesMatriz.map((p) => ({
                        text: p.description || "N/A",
                        bold: true,
                        alignment: "center"
                    }))
                );

                const body = matriz.severidadesMatriz.map((s) => {
                    const row = [{ text: s.description || "N/A", bold: true, alignment: "left" }];

                    matriz.probabilidadesMatriz.forEach((p) => {
                        const valor = s.position * p.position;

                        // Encontra a classificação de risco correspondente
                        const classificacao = matriz.classificacaoRiscoMatriz.find(
                            (c) => c.grau_risco === valor
                        );

                        let bgColor = classificacao?.cor || "#ffffff";
                        let textColor = "#000000";

                        // Se a cor de fundo for preta ou escura, texto branco
                        if (bgColor === "#000000" || bgColor.toLowerCase() === "black") textColor = "#ffffff";

                        row.push({
                            text: valor.toString(),
                            alignment: "center",
                            fillColor: bgColor,
                            color: textColor
                        });
                    });

                    return row;
                });

                body.unshift(headerRow);

                // Tabela de classificação de risco
                const classificacaoTableBody = [
                    [
                        { text: "Grau de Risco", bold: true, alignment: "center" },
                        { text: "Classe de Risco", bold: true, alignment: "center" }
                    ],
                    ...matriz.classificacaoRiscoMatriz.map((c) => [
                        { text: c.grau_risco?.toString() || "N/A", alignment: "center" },
                        { text: c.classe_risco?.trim() || "N/A", alignment: "center" }
                    ])
                ];

                return [
                    {
                        text: `Matriz de Risco ${matriz.info.tipo || ""} ${matriz.info.parametro || ""}`,
                        fontSize: 12,
                        bold: true,
                        margin: [-20, 10, -20, 5],
                        alignment: "center"
                    },
                    {
                        table: {
                            headerRows: 1,
                            widths: Array(matriz.probabilidadesMatriz.length + 1).fill("*"),
                            body
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 0.5),
                            vLineWidth: () => 0.5,
                            hLineColor: () => "#666666",
                            vLineColor: () => "#666666",
                            paddingLeft: () => 8,
                            paddingRight: () => 8,
                            paddingTop: () => 4,
                            paddingBottom: () => 4
                        },
                        margin: [-20, 5, -20, 10]
                    },
                    {
                        text: "Classificação de Risco",
                        fontSize: 11,
                        bold: true,
                        margin: [0, 5, 0, 5]
                    },
                    {
                        table: {
                            headerRows: 1,
                            widths: ["*", "*"],
                            body: classificacaoTableBody
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 0.5),
                            vLineWidth: () => 0.5,
                            hLineColor: () => "#666666",
                            vLineColor: () => "#666666",
                            paddingLeft: () => 6,
                            paddingRight: () => 6,
                            paddingTop: () => 4,
                            paddingBottom: () => 4
                        },
                        margin: [-20, 0, -20, 10]
                    }
                ];
            }).filter(Boolean);
















            const responseServico = await getResponsavelByServico(empresa.dataValues.id, servicoId);
            const servicoData = await getDadosServicoByEmpresaServico(empresa.dataValues.id, servicoId);
            const servicoToDocBase = await getDadosServicoByEmpresaServicoToDocbase(empresa.dataValues.id, servicoId);

            const participantes = servicoToDocBase.dataValues.participantes.map((item) => {
                return item.dataValues;
            });

            const memorialProcessos = servicoToDocBase.dataValues.memorialProcessos.map((item) => {
                return item.dataValues;
            });

            const responsaveisTecnicos = servicoToDocBase.dataValues.responsavelTecnicoServicos.map((item) => {
                return item.dataValues.responsavelTecnico.dataValues;
            })

            const meses = [
                "janeiro", "fevereiro", "março", "abril", "maio", "junho",
                "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
            ];

            const dataInicio = servicoData.dataValues.data_inicio;
            const dataFim = servicoData.dataValues.data_fim;

            const diaInicio = dataInicio.slice(8, 10);
            const mesInicioNum = Number(dataInicio.slice(5, 7)) - 1;
            const mesInicioNome = meses[mesInicioNum];
            const anoInicio = dataInicio.slice(0, 4);

            const diaFim = dataFim.slice(8, 10);
            const mesFimNum = Number(dataFim.slice(5, 7)) - 1;
            const mesFimNome = meses[mesFimNum];
            const anoFim = dataFim.slice(0, 4);

            const processo = memorialProcessos;

            const dataDadosEstatisticos = await getDataDadosEstatisticosByOneLaudoType(empresa.dataValues.id, servicoId, "pgr");

            let dadosEstatisticosFinal = [];

            // Prepara os dados estatísticos com imagem (se houver)
            await Promise.all(dataDadosEstatisticos.map(async (e) => {
                const urlImagem = e?.dataValues?.url_imagem;
                const descricao = e?.dataValues?.descricao || "";

                let imagem = null;
                if (urlImagem) {
                    try {
                        imagem = await getFileToS3(urlImagem);
                    } catch (error) {
                        console.log(`Erro ao buscar imagem do S3: ${urlImagem}`, error);
                    }
                }

                dadosEstatisticosFinal.push({
                    url_imagem: imagem?.url ? imagem.url : null,
                    descricao
                });
            }));

            // Converte as imagens em base64, se houver
            await Promise.all(dadosEstatisticosFinal.map(async (e) => {
                if (e.url_imagem) {
                    try {
                        const image64 = await getImageData(e.url_imagem);
                        e.base64 = image64?.data || "";
                    } catch (error) {
                        console.log(`Erro ao converter imagem em base64: ${e.url_imagem}`, error);
                        e.base64 = "";
                    }
                } else {
                    e.base64 = "";
                }
            }));








            let memorialProcessosFinal = [];

            // Prepara os dados estatísticos com imagem (se houver)
            await Promise.all(memorialProcessos.map(async (e) => {
                const urlImagem = e?.url_imagem;
                const descricao = e?.descricao || "";

                let imagem = null;
                if (urlImagem) {
                    try {
                        imagem = await getFileToS3(urlImagem);
                    } catch (error) {
                        console.log(`Erro ao buscar imagem do S3: ${urlImagem}`, error);
                    }
                }

                memorialProcessosFinal.push({
                    url_imagem: imagem?.url ? imagem.url : null,
                    descricao
                });
            }));

            // Converte as imagens em base64, se houver
            await Promise.all(memorialProcessosFinal.map(async (e) => {
                if (e.url_imagem) {
                    try {
                        const image64 = await getImageData(e.url_imagem);
                        e.base64 = image64?.data || "";
                    } catch (error) {
                        console.log(`Erro ao converter imagem em base64: ${e.url_imagem}`, error);
                        e.base64 = "";
                    }
                } else {
                    e.base64 = "";
                }
            }));

            const stack = [
                // {
                //     text: 'Sumário',
                //     fontSize: 16,
                //     bold: true,
                //     alignment: 'center',
                //     color: '#40618b'
                // },
                {
                    text: '1. SIGLAS',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: `ABHO - Associação Brasileira de Higienistas Ocupacionais
ACGIH - American Conference of Governmental Industrial Hygienists
AIHA - American Industrial Hygienists Association
CAS - Chemical Abstracts Service
CIPA - Comissão Interna de Prevenção de Acidentes
EA – Estratégia de Amostragem baseada na NIOSH 1977
GES – Grupo de Exposição Similar
GHE - Grupo Homogêneo de Exposição
HO - Higiene Ocupacional
IPVS - Condição imediatamente perigosa à vida ou à saúde
LE - Limite de Exposição
LI – Laudo de Insalubridade conforme NR-15 da Portaria 3214/78 do MTE
LP – Laudo de Periculosidade conforme NR-16 da Portaria 3214/78 do MTE
LT - Limite de Tolerância
MTE - Ministério do Trabalho e Emprego
N/A – Não Aplicável
N no campo e-social (PPP) – Não transmitir risco para o e-Social.
NIOSH - National Industrial Occupational Safety and Helth
NHO – Norma de Higiene Ocupacional da Fundacentro
OIT - Organização Internacional do Trabalho
OMS - Organização Mundial de Saúde
OSHA - Occupational Safety and Health Administration
PCMSO - Programa de Controle Médico de Saúde Ocupacional
PPEOB - Programa de Prevenção da Exposição Ocupacional ao Benzeno, conforme Anexo 13-A da NR-15 PPR -
Programa previsto na Instrução Normativa no.1 da DSST, de 11.04.94
PPP – Perfil Profissiográfico Previdenciário
PPRA - Programa de Prevenção de Riscos Ambientais tal como definido pela NR-9 do TEM
S no campo e-social (PPP) – Transmitir risco para o e-Social
SIPAT - Semana Interna de Prevenção de Acidentes de Trabalho
TIPO DE RISCO – F (Físico); Q (Químico); B (Biológico); M (Mecânico ou Acidente); E (Ergonômico)
TLV - Threshold Limit Values
TLV-C - Limite de Exposição Valor Teto – (Ceiling Exposure Value) - O TLV-C refere-se à concentração que não
deve ser excedida durante nenhum momento de exposição no trabalho
TLV-STEL - Limite de Exposição de Curta Duração - (ShortTerm Exposure Value) - é a concentração máxima no
ar de um agente químico ou biológico ao qual um trabalhador pode estar exposto em qualquer período de 15
minutos, mesmo que o TWA não seja excedido
TLV-TWA - (Time Weight Average) - é a concentração média ponderada no tempo para uma jornada normal de
8h diárias e 40h semanais, à qual, acredita-se, que a maioria dos trabalhadores possa estar repetidamente
exposta, dia após dia, durante toda vida de trabalho, sem sofrer prejuízos
                    `,
                    fontSize: 10,
                    bold: false,
                    alignment: 'left',
                },

                {
                    text: '2. REFERÊNCIAS BIBLIOGRÁFICAS',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: `ABNT NBR ISO 31000:2018. Gestão de riscos – Diretrizes.
ABNT NBR IEC 31010:2021. Gestão de riscos - Técnicas para o processo de avaliação de riscos.
AIHA - American Industrial Hygiene Association. A strategy for assessing and managing occupational exposures. 4th ed. Falls Church; 2015.
ARAÚJO, Giovanni Moraes & REGAZZI, Rogério Dias. Perícia e Avaliação do Ruído e Calor Passo a Passo - Teoria e Prática. Rio de Janeiro: (s.n), 2002.
BUONO Neto, Antônio & BUONO, Elaine Arbex. Perícia e Processo Trabalhista. 2ª ed. Curitiba: Genesis, 1995.
BRASIL. Fundacentro. Normas de Higiene Ocupacional.
BRASIL. Ministério do Trabalho e Emprego. Normas Regulamentadoras. Brasília: Ministério do Trabalho e Emprego, 1978.
ANDREI, Edmondo. Compêndio de Defensivos Agrícolas. 7ª Ed. São Paulo: Andrei, 2005.
GARCIA, Gustavo Filipe Barbosa. Segurança e Medicina do Trabalho. São Paulo: Método, 2007.
GONÇALVES, Edwar Abreu. Manual de Segurança e Saúde no Trabalho. 5ª ed. São Paulo: LTr, 2011.
Limites de Exposição (TLVs) para Substâncias Químicas e Agentes Físicos da ACGIH
Occupational Exposure Sampling Strategy of NIOSH – 1977
MORAES, Giovanni Araújo. Normas Regulamentadoras Comentadas. 6ª ed. Rio de Janeiro, 2007.
PATNAIK, Pradyot. Guia Geral: Propriedades Nocivas das Substâncias Químicas. 2ª ed. Belo Horizonte: Ergo, 2011.
PEREIRA, Fernandes José & CASTELLO, Orlando Filho. Manual prático: como elaborar uma perícia de insalubridade e de periculosidade. 2ª ed. São Paulo: LTr, 2000.
SALIBA, Tuffi Messias & CORRÊA, Márcia Angelim Chaves. Insalubridade e Periculosidade: aspectos técnicos e práticos. 7ª ed. São Paulo: LTr, 2004.
SALIBA, Tuffi Messias & PAGANO, Sofia C. Reis Saliba. Legislação de segurança, acidente do trabalho e saúde do trabalhador. 5ª ed. São Paulo: LTr, 2007.
SHERIQUE, Jaques. Aprenda como fazer:... 4ª ed. São Paulo: LTr, 2004.
VENDRAME, Antônio Carlos F. Curso de Introdução à Perícia Judicial. São Paulo: LTr, 1997
                    `,
                    fontSize: 10,
                    bold: false,
                    alignment: 'left',
                },

                {
                    text: '3. INTRODUÇÃO',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tUma organização é responsável pela saúde e segurança ocupacional dos seus trabalhadores e da comunidade. Esta responsabilidade inclui promover e proteger a saúde física e psicossocial dos envolvidos. A adoção de um sistema de gestão de saúde e segurança ocupacional (SSO), destina-se a permitir que uma organização forneça locais de trabalho seguros e saudáveis, evitando lesões e problemas de saúde relacionados ao trabalho e melhorando continuamente seu desempenho de SSO (ABNT NBR ISO 31000:2018).
`
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tA Secretaria de Inspeção do Trabalho, através da Portarias SEPRT 6.730 de 09 de março de 2020, publicou a nova redação da Norma Regulamentadora NR-01. O objetivo principal foi estabelecer as diretrizes e os requisitos para o gerenciamento de riscos ocupacionais e as medidas de prevenção em Segurança e Saúde no Trabalho - SST.`
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tA implementação do Programa de Gerenciamento de Riscos, possibilitou aos gestores desenvolverem e implementarem ações de melhorias nos ambientes de trabalho, visando à preservação da saúde e da integridade dos trabalhadores e comunidade. `
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tUm nível consistente de atenção e gestão dos riscos, é importante para evitar acidentes e doenças relacionadas com as operações da empresa. A implementação dessa gestão visa a avaliação e melhoria das condições laborativas, englobando saúde e segurança no trabalho, onde suas ações serão desenvolvidas no âmbito da unidade operacional, contemplando setor ou atividade da empresa.`
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tImportante destacar, que devem ser adotados mecanismos para consultar os trabalhadores, quanto à percepção de riscos ocupacionais, através das manifestações da Comissão Interna de Prevenção de Acidentes – CIPA, quando houver, e comunicação aos trabalhadores sobre os riscos consolidados no inventário de riscos e as medidas a serem tomadas no plano de ação. Também, quando possível, deve haver a participação de um representante indicado pelo sindicato da categoria preponderante, afim de aperfeiçoar de maneira contínua os níveis de proteção e desempenho no campo da segurança e saúde no trabalho, sob a responsabilidade do empregador.`
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tO empregador deve colocar em prática uma abordagem planejada, estruturada e global da prevenção, por meio do gerenciamento dos fatores de risco em Segurança e Saúde no Trabalho - SST, utilizando-se de todos os meios técnicos, organizacionais e administrativos para assegurar o bem-estar dos trabalhadores e garantir que os ambientes e condições de trabalho sejam seguros e saudáveis.`
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tEm resumo, o Programa de Gerenciamento de Riscos, de acordo com a Norma Regulamentadora NR01, constitui-se numa ferramenta de extrema importância para a segurança e saúde dos empregados, proporcionando identificar os perigos, as medidas de proteção ao trabalhador a serem implementadas. E para finalizar, devem estar integrados com planos, programas e outros documentos previstos na legislação de segurança e saúde no trabalho.
                    `
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: '4. OBJETIVO GERAL',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tO Programa de Gerenciamento de Riscos – PGR, possuí como objetivo principal identificar os perigos e introduzir medidas de prevenção para a sua eliminação ou redução, assim como para determinar se as medidas previstas ou existentes são adequadas, de forma que possibilite a evitar possíveis lesões ou agravo a saúde dos trabalhadores.`
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tDeste modo, a documentação apresentada representa a metodologia de desenvolvimento de um processo de melhoria contínua, baseado na metodologia do ciclo PDCA que visa alcançar os resultados através de uma gestão interativa, considerando as etapas de Planejamento, Desenvolvimento, Controle e Ação. Os referidos documentos que compõe o PGR são atualizados de forma constante e, de acordo com as necessidades da organização, considerando as atualizações do Inventário de Riscos e os cronogramas e adequações determinados no Plano de Ação
                    `
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: '5. OBJETIVO ESPECÍFICO',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tPara a gestão de riscos, a organização deve considerar as condições de trabalho em seu
gerenciamento para:
a) evitar os riscos ocupacionais que possam ser originados no trabalho;
b) identificar os perigos e possíveis lesões ou agravos à saúde;
c) avaliar os riscos ocupacionais, indicando o nível de risco;
d) classificar os riscos ocupacionais, para determinar a necessidade de adoção de medidas de prevenção;
e) implementar medidas de prevenção, de acordo com a classificação de risco e na ordem de prioridade, para
eliminação dos fatores de risco; minimização e controle dos fatores de risco, com a adoção de medidas de
proteção coletiva; minimização e controle dos fatores de risco, com a adoção de medidas administrativas ou de
organização do trabalho; e adoção de medidas de proteção individual;
f) acompanhar, monitorando o controle dos riscos ocupacionais;
                    `
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: '6. DADOS ESTATÍSTICOS',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        { text: ".", color: "#ffffff" },  // Espaço branco invisível para espaçamento
                        "\t\t\tPara o desenvolvimento do referido programa, faz-se importante o conhecimento das estatísticas de adoecimento e acidentes de trabalho na atividade desenvolvida.\n\n",

                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    stack: dadosEstatisticosFinal.flatMap(e => {
                        const bloco = [
                            {
                                text: "• " + e.descricao || "",
                                fontSize: 10,
                                alignment: "justify",
                                margin: [5, 5, 5, 10],
                                lineHeight: 1.2,
                            }
                        ];

                        if (e.base64) {
                            bloco.push({
                                image: e.base64,
                                width: 250,
                                height: 250,
                                alignment: 'center',
                                margin: [0, 0, 0, 10],
                            });
                        }

                        return bloco;
                    })
                },

                {
                    text: '7. IDENTIFICAÇÃO DA EMPRESA',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },

                {
                    text: [
                        {
                            text: "Razão Social: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${cliente ? cliente.dataValues.razao_social : ""}\n`,
                        {
                            text: "CNPJ: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${cliente ? cliente.dataValues.cnpj : ""}\n`,
                        {
                            text: "Código CNAE: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${cliente ? cliente.dataValues.cnae : ""}\n`,
                        {
                            text: "Atividade Principal: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${cliente ? cliente.dataValues.atividade_principal : ""}\n`,
                        {
                            text: "Grau de Risco: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${cliente ? cliente.dataValues.grau_de_risco : ""}\n`,
                        {
                            text: "Localização: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${cliente ? cliente.dataValues.localizacao_completa : ""}; ${cliente ? cliente.dataValues.cidade : ""}; ${cliente ? cliente.dataValues.estado : ""}\n\n`,
                    ],
                    fontSize: 10,
                    bold: false,
                    alignment: 'left',
                },

                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t7.1 RESPONSABILIDADES`
                    ],
                    fontSize: 10,
                    bold: true,
                },

                {
                    text: [
                        {
                            text: "Razão Social: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${empresa ? empresa.dataValues.nome : ""}\n`,
                        {
                            text: "CNPJ: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${empresa ? empresa.dataValues.cnpj : ""}\n`,
                        {
                            text: "Localização: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${empresa ? empresa.dataValues.endereco : ""}\n`,
                        {
                            text: "CREA: ",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        `${empresa && empresa.dataValues.nmrCrea !== null ? empresa.dataValues.nmrCrea : ""}\n`,



                        {
                            text: responsaveisTecnicos.length > 0 ? "Responsáveis Técnico: " : "",
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        // {
                        //     text: "ART Vinculada: ",
                        //     fontSize: 10,
                        //     bold: true,
                        //     alignment: 'left',
                        // },
                        // `lorem lorem lorem\n`,
                        // {
                        //     text: "Responsável pelo PGR: ",
                        //     fontSize: 10,
                        //     bold: true,
                        //     alignment: 'left',
                        // },
                        // `${responseServico ? responseServico.dataValues.responsavel_aprovacao : ""}\n\n`,

                    ],
                    fontSize: 10,
                    bold: false,
                    alignment: 'left',
                },

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
                                        margin: [5, 5, 5, 10],
                                        lineHeight: 1.2,
                                    }
                                )
                            } else {
                                bloco.push(
                                    {
                                        text: "• " + e.funcao + " " + e.nome,
                                        fontSize: 10,
                                        alignment: "justify",
                                        margin: [5, 5, 5, 10],
                                        lineHeight: 1.2,
                                    }
                                )
                            }
                        }



                        return bloco;
                    })
                },

                {
                    text: participantes.length > 0 ? "Participantes: " : "",
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },

                {
                    stack: participantes ? participantes.flatMap(e => {
                        const bloco = [];

                        bloco.push(
                            {
                                text: "• " + (e.nome ? e.nome + "; " : "") + (e.cargo ? e.cargo + "; " : "") + (e.setor ? e.setor : ""),
                                fontSize: 10,
                                alignment: "justify",
                                margin: [5, 5, 5, 10],
                                lineHeight: 1.2,
                            }
                        )

                        return bloco;
                    }) : []
                },

                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t7.2 GESTÃO DE TERCEIROS`
                    ],
                    fontSize: 10,
                    bold: true,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tFaz parte desse programa, estabelecer mecanismos e orientações sobre os aspectos dos riscos ocupacionais durante gestão do contrato de Empresas Prestadoras de Serviços, de modo a prevenir a ocorrência de perdas na execução dos serviços contratados.
                    `,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tDesta forma, assegura-se que os Prestadores de Serviços estejam comprometidos e tenham práticas, procedimentos e desempenho alinhados com a Política sobre Sustentabilidade da Organização e com as Diretrizes de Segurança, Saúde e Meio Ambiente.
                    `,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tImportante destacar que que os Micro Empreendedores Individuais (MEI) também fazem parte dessa gestão.
                    `,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tPara tanto, a empresa possui procedimento escrito onde vários requisitos são exigidos para que a prestação de serviço ocorra dentro da legislação vigente. Após o cumprimento de todos os requisitos, o prestador de serviço e seus trabalhadores são aprovados e direcionados para a integração de segurança, onde recebem capacitação sobre os riscos ocupacionais da organização. Toda essa gestão é documentada para que seja evidenciada durante auditorias.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t7.3 ABRANGÊNCIA DO P.G.R.`
                    ],
                    fontSize: 10,
                    bold: true,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tEste programa foi implementado e desenvolvido em apenas 01 (um) P.G.R., abrangendo a área industrial conforme solicitação da organização.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                memorialProcessosFinal && {
                    text: '8. MEMORIAL DESCRITIVO DO PROCESSO',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },

                {
                    stack: memorialProcessosFinal.flatMap(e => {
                        const bloco = [
                            {
                                text: "• " + e.descricao || "",
                                fontSize: 10,
                                alignment: "justify",
                                margin: [5, 5, 5, 10],
                                lineHeight: 1.2,
                            }
                        ];

                        if (e.base64) {
                            bloco.push({
                                image: e.base64,
                                width: 250,
                                height: 250,
                                alignment: 'center',
                                margin: [0, 0, 0, 10],
                            });
                        }

                        return bloco;
                    })
                },
                // {
                //     text: [
                //         {
                //             text: ".",
                //             color: "#ffffff"
                //         },
                //         `\t\t\t${processo || ""}
                //     `,
                //     ],
                //     fontSize: 10,
                //     bold: false,
                // },

                {
                    text: `${processo ? "9." : "8."} MEIO AMBIENTE DE TRABALHO E ATIVIDADES`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tAs descrições das instalações físicas e das atividades desempenhadas encontram-se na descrição do GES, na sequência desse documento base.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: `${processo ? "10." : "9."} ESTRUTURA DO PROGRAMA`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tAs descrições das instalações físicas e das atividades desempenhadas encontram-se na descrição do GES, na sequência desse documento base.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: 'INVENTÁRIO DE RISCOS',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tOs dados da identificação dos perigos e das avaliações dos riscos ocupacionais foram consolidados em um inventário de riscos ocupacionais com as seguintes informações:
a) caracterização dos processos e ambientes de trabalho;
b) caracterização das atividades;
c) descrição de perigos e de possíveis lesões ou agravos à saúde dos trabalhadores, com a identificação das
fontes ou circunstâncias, descrição de riscos gerados pelos perigos, com a indicação dos grupos de
trabalhadores sujeitos a esses riscos, e descrição de medidas de prevenção implementadas;
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: 'PLANO DE AÇÃO',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tNo plano de ação são indicadas as medidas de prevenção a serem introduzidas, aprimoradas ou mantidas, conforme o nível de risco ocupacional, determinado pela combinação da severidade das possíveis lesões ou agravos à saúde com a probabilidade ou chance de sua ocorrência.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tPara as medidas de prevenção a serem implementadas, foi definido um cronograma, formas de acompanhamento e aferição de resultados.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: 'PLANO DE EMERGÊNCIA',
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tNo plano de emergência da empresa são indicados possível cenários de acidentes, conforme riscos identificados no PGR, bem como as medidas a serem introduzidas, aprimoradas ou mantidas, conforme o nível da emergência.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tPara as medidas a serem implementadas, foi definido um cronograma, formas de acompanhamento e aferição de resultados.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: `${processo ? "11." : "10."} DEFINIÇÃO DE PERIGOS`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tOs perigos podem incluir fontes com potencial de causar danos ou situações perigosas, ou circunstâncias com potencial de exposição, levando a lesões e problemas de saúde (ABNT NBR ISO 31000:2018)`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tOs perigos físicos são considerados as diversas formas de energia a que possam estar expostos os trabalhadores, tais como ruído, vibrações, pressões anormais, temperaturas extremas, radiações ionizantes, radiações não ionizantes, bem como o infrassom e o ultrassom. Estes agentes físicos são caracterizados por toda forma de energia que afeta o trabalhador fisicamente, podendo ocasionar acidentes ou doenças ocupacionais.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tOs perigos químicos, consideram-se as substâncias, compostas ou produtos que possam penetrar no organismo pela via respiratória ou pela ingestão, nas formas de poeiras, fumos, nevoas, neblinas, gases ou vapores, ou que pela natureza da atividade de exposição, possam ter contato ou serem absorvidos pelo organismo, através da pele, mucosas ou por ingestão.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tOs perigos biológicos são aqueles provenientes de microrganismos, que podem penetrar no organismo do trabalhador pela via respiratória, em contato com a pele, mucosas ou por ingestão. Consideramse agentes biológicos: as bactérias, fungos, bacilos, parasitas, protozoários, vírus, entre outros.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tOs perigos ergonômicos são todas as condições biomecânicas ou psicossociais inadequadas para o trabalhador, ou seja, aqueles que não atendem satisfatoriamente, às condições físicas e psicológicas do trabalhador para que ele desempenhe suas tarefas adequadamente. São elas: esforço físico intenso, levantamento e transporte manual de peso, exigência de postura inadequada, controle rígido de produtividade, imposição de ritmos excessivos, trabalho em turno e noturno, jornadas de trabalho prolongadas, monotonia e repetitividade, outras situações causadoras de stress físico e/ou psíquico. Esses agentes deixam o trabalhador exposto a diferentes riscos para sua integridade física, aumentando a suscetibilidade de acidentes, problemas e doenças.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tPerigos de acidentes/mecânicos são os fatores de riscos como: arranjo físico inadequado, máquinas e equipamentos sem proteção, ferramentas inadequadas ou defeituosas, iluminação inadequada, eletricidade, probabilidade de incêndio ou explosão, armazenamento inadequado, animais peçonhentos, entre outras situações de perigo que poderão contribuir para a ocorrência de acidentes. 
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: `${processo ? "12." : "11."} DIRETRIZES DO PROGRAMA`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tAs diretrizes e propostas de estrutura para a elaboração do programa foram baseadas na ISO 31000:2018.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tA estrutura do PGR contempla a identificação os fatores de risco ocupacional dos trabalhadores, através do inventário de riscos e do plano de ação para melhoria do ambiente laboral, conforme o mínimo previsto nas Normas Regulamentadora NR-01. Importante destacar que esse programa inicial e mínimo, deve ser objeto de melhoria contínua, atendendo todos os pilares do gerenciamento de riscos ocupacionais (GRO), previsto nas normas técnicas oficiais vigentes.
                    `,
                    ],
                    fontSize: 10,
                    bold: false,
                },

                {
                    text: `${processo ? "13." : "12."} INVENTÁRIO DE RISCO`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        { text: ".", color: "#ffffff" },
                        `\t\t\tNo inventário de riscos, foram contempladas as seguintes informações:
a) Caracterização sucinta dos processos e ambientes de trabalho;
b) Caracterização das funções e atividades;
c) Critérios adotados para avaliação dos riscos e tomada de decisão;
d) Dados disponíveis relativos a monitoramentos de exposições a agentes ambientais, de acidentes e danos à saúde relacionados ao trabalho;
e) Descrição dos perigos, com identificação dos trabalhadores expostos, fatores determinantes dos riscos e das medidas de controle existentes;
f) Avaliação dos riscos, incluindo sua estimativa e classificação em termos da importância para fins preventivos;
g) Para a classificação dos perigos e os fatores de riscos identificados, foram utilizadas as matrizes (referência AIHA – riscos físicos, químicos e biológicos e definida pelo procedimento da empresa – riscos mecânicos; para os riscos ergonômicos, foi utilizada a matriz da análise ergonômica, indicada pela responsável técnico;`,
                    ],
                    fontSize: 10,
                    bold: false,
                    margin: [0, 0, 0, 10],
                },
                ...pdfMatrizBlocks.flat(),

                {
                    text: `${processo ? "14." : "13."} PLANO DE AÇÃO`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tA organização deve elaborar plano de ações para cada os fatores de riscos enquadrados conforme tomada de decisão estabelecida.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tA organização deve tomar as medidas necessárias e suficientes para eliminar ou reduzir os riscos sempre que houver:
a) exigências legais aplicáveis;
b) níveis de risco que assim o determinem;
c) evidências epidemiológicas ou na literatura técnica indicativas de possíveis danos à saúde relacionados às fontes identificadas;
d) evidências, na organização ou em processos de trabalho e produção análogos, de relação entre o trabalho e danos à saúde dos trabalhadores;`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tPara cada ação preventiva devem ser definidos cronograma, responsáveis, recursos humanos, materiais e financeiros e formas de acompanhamento e aferição de resultados.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tQuando comprovada pelo empregador, a inviabilidade técnica da adoção de medidas de proteção coletiva ou quando estas não forem suficientes, ou se encontrarem em fase de estudo, planejamento ou implantação, ou ainda em caráter complementar, ou emergencial e temporário, devem ser adotadas as medidas preventivas necessárias, aplicando-se medidas de caráter administrativo e de organização do trabalho e, secundariamente, proteção baseada em Equipamentos de Proteção Individual - EPI.`,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tAlém das medidas para eliminar ou reduzir os riscos existentes, a organização deve adotar medidas para controlar os riscos:
a) nas mudanças planejadas, temporárias ou permanentes, que possam dar origem a riscos relevantes;
b) na aquisição de produtos e serviços, incluindo funções e processos terceirizados;
                        `,
                    ],
                    fontSize: 10,
                    bold: false,
                },
                {
                    text: `${processo ? "15." : "14."} COMUNICAÇÃO AOS TRABALHADORES E CONSULTA QUANTO À PERCEPÇÃO DE RISCOS OCUPACIONAIS`,
                    fontSize: 10,
                    bold: true,
                    alignment: 'left',
                },
                {
                    text: [
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tA comunicação dos perigos e fatores de riscos elencados no inventário foi realizada através da CIPA/CIPATR e da ordem de serviço com devido treinamento e assinatura individual.
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tSobre a percepção de riscos, será realizada pesquisa, junto aos trabalhadores, estando fundamentada em 3 pilares a saber:
Pilar 01: Tema liderança. O que a liderança faz para guiar os colaboradores a alcançar a excelência em saúde e
segurança?
Pilar atrelado à liderança:
                    `,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Comprometimento da Liderança;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Políticas e princípios;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Metas, objetivos & planos;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Procedimentos & padrões de desempenho.
`,
                        `Pilar 02: Tema estrutura. Quais estruturas organizacionais promovem a busca pela excelência em saúde e segurança? 
Pilar atrelado a estrutura:
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Responsabilidade de linha;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Profissionais de segurança;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Organização estruturada integrada;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Motivação e reconhecimento.
`,
                        `Pilar 03: Tema processos e ações. Quais ações a organização toma regularmente para melhorar o desempenho em saúde e segurança?
Pilar atrelado a processos e ações:
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Comunicação efetiva;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Treinamento e desenvolvimento;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Investigação de incidentes;
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\t• Auditorias & observações.
`,
                        `A pesquisa de percepção de clima de segurança será aplicada em uma amostragem significativa de integrantes, incluindo diretores, gerentes, coordenadores, supervisão, administrativo e área operacional. O relatório completo será anexado a esse programa, conforme plano de ação.
`,

                        {
                            text: `${processo ? "16." : "15."} CONSIDERAÇÕES FINAIS\n`,
                            fontSize: 10,
                            bold: true,
                            alignment: 'left',
                        },
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tEste programa foi iniciado em ${diaInicio} de ${mesInicioNome} de ${anoInicio}, e foi concluído em ${diaFim} de ${mesFimNome} de ${anoFim}.
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tFoi digitado, datado e assinado digitalmente pelo responsável pela elaboração.
`,
                        {
                            text: ".",
                            color: "#ffffff"
                        },
                        `\t\t\tFaz parte deste documento a ART (Anotação de Responsabilidade Técnica).
`,
                        {
                            text: `${cliente.dataValues.cidade}-${cliente.dataValues.estado}, ${diaFim} de ${mesFimNome} de ${anoFim}`,
                            fontSize: 10,
                            bold: false,
                            alignment: 'left',
                        },
                    ],
                    fontSize: 10,
                    bold: false,
                },
                responsaveisTecnicos.map((e) => {
                    const bloco = [];

                    if (e.nome && e.funcao) {
                        if (e.numero_crea && e.estado_crea) {
                            bloco.push(
                                {
                                    text: e.funcao + " " + e.nome + " " + "CREA-" + e.estado_crea + ": " + e.numero_crea,
                                    fontSize: 10,
                                    alignment: "center",
                                    margin: [5, 5, 5, 10],
                                    lineHeight: 1.2,
                                    bold: true,
                                },
                                {
                                    text: "_______________________________________________________________",
                                    fontSize: 10,
                                    alignment: "center",
                                    margin: [5, 5, 5, 10],
                                    lineHeight: 2,
                                }
                            )
                        } else {
                            bloco.push(
                                {
                                    text: e.funcao + " " + e.nome,
                                    fontSize: 10,
                                    alignment: "center",
                                    margin: [5, 5, 5, 10],
                                    lineHeight: 1.2,
                                    bold: true,
                                },
                                {
                                    text: "_______________________________________________________________",
                                    fontSize: 10,
                                    alignment: "center",
                                    margin: [5, 5, 5, 10],
                                    lineHeight: 2,
                                }
                            )
                        }
                    }

                    return bloco;
                }),

                {
                    text: "Responsável pela Empresa",
                    fontSize: 10,
                    alignment: "center",
                    margin: [5, 5, 5, 10],
                    lineHeight: 1.2,
                    bold: true,
                },
                {
                    text: "_______________________________________________________________",
                    fontSize: 10,
                    alignment: "center",
                    margin: [5, 5, 5, 10],
                    lineHeight: 2,
                }
            ];

            return stack;
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