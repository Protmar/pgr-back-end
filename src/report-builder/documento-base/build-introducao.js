const { getAllGesByServico } = require("../../services/ges");
const { getFileToS3 } = require("../../services/aws/s3/index");
const { getImageData } = require("../utils/report-utils");
const { convertToPng } = require("../utils/image-utils");

module.exports = {
    buildIntroducao: async (reportConfig) => {
        try {
            const servico_id = 7;
            const data = await getAllGesByServico(servico_id);

            if (!data || !Array.isArray(data)) {
                throw new Error("Dados inválidos retornados do serviço");
            }

            const createHeaderRow = () => {
                return [
                    { text: "GES", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                    { text: "Descrição GES", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                    { text: "Caracterização dos Processos", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                    { text: "Caracterização dos Ambientes", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                    { text: "Responsável", fontSize: 12, bold: true, alignment: "center", fillColor: "#2f945d", color: "white" },
                ];
            };

            const createTitle = () => ({
                text: "INTRODUÇÃO",
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 10]
            });

            const tables = await Promise.all(data.map(async (e, index) => {
                const imagemBase = await getImageData(reportConfig.noImageUrl);
                let imagem = null;

                const nomeFluxograma = e.dataValues.nome_fluxograma || null;

                try {
                    if (nomeFluxograma) {
                        const urlImage = await getFileToS3(nomeFluxograma);
                        imagem = await getImageData(urlImage.url);

                        if (imagem.type === 'webp') {
                            imagem.data = await convertToPng(imagem.data, 250);
                        }
                    }
                } catch (err) {
                    console.error(`Erro ao processar imagem para tabela ${index}:`, err);
                    imagem = null;
                }

                const imageData = [{
                    image: imagem ? imagem.data : imagemBase.data,
                    width: 250,
                    alignment: "center",
                    colSpan: 5
                }];

                const ambiente = e.ambientesTrabalhos?.[0] || {};
                const tableDefinition = {
                    table: {
                        widths: ['5%', '*', '30%', '30%', '*'], // Consistente para todas as tabelas
                        body: [
                            createHeaderRow(),
                            [
                                { text: String(e.id), fontSize: 12, alignment: "center" },
                                { text: e.descricao_ges || "N/A", fontSize: 12, alignment: "center" },
                                { text: e.texto_caracterizacao_processos, fontSize: 12, alignment: "center" },
                                {
                                    text: [
                                        `• Área: ${ambiente.area || "N/A"}\n`,
                                        `• Pé Direito: ${ambiente.pe_direito || "N/A"}\n`,
                                        `• Qtd. Janelas: ${ambiente.qnt_janelas || "N/A"}\n`,
                                        `• Qtd. Equipamentos: ${ambiente.EquipamentoAmbienteTrabalho?.length || "N/A"}\n`,
                                        `• Teto: ${ambiente.teto?.descricao || "N/A"}\n`,
                                        `• Edificação: ${ambiente.edificacao?.descricao || "N/A"}\n`,
                                        `• Piso: ${ambiente.piso?.descricao || "N/A"}\n`,
                                        `• Parede: ${ambiente.parede?.descricao || "N/A"}\n`,
                                        `• Ventilação: ${ambiente.ventilacao?.descricao || "N/A"}\n`,
                                        `• Iluminação: ${ambiente.iluminacao?.descricao || "N/A"}\n`,
                                        `• Informações Adicionais: ${ambiente.informacoes_adicionais || "N/A"}`
                                    ],
                                    fontSize: 10,
                                    alignment: "left",
                                },
                                { text: e.responsavel || "N/A", fontSize: 12, alignment: "center" },
                            ],
                            [
                                { 
                                    text: "Fluxograma", 
                                    fontSize: 12, 
                                    alignment: "center", 
                                    colSpan: 5, 
                                    margin: [0, 10, 0, 0], 
                                    fillColor: "#f0f0f0"
                                }
                            ],
                            imageData
                        ]
                    },
                    layout: {
                        hLineWidth: (i, node) => 0.5,
                        vLineWidth: (i, node) => 0.5,
                        paddingLeft: (i, node) => 0,  // Remove preenchimento à esquerda
                        paddingRight: (i, node) => 0, // Remove preenchimento à direita
                    },
                };

                return {
                    stack: [
                        createTitle(),
                        tableDefinition
                    ],
                    pageBreak: index < data.length - 1 ? 'after' : undefined, // Aplica pageBreak condicionalmente
                };
            }));

            // Log para depuração
            console.log("Tabelas geradas:", JSON.stringify(tables, null, 2));
            return tables;

        } catch (error) {
            console.error("Erro ao construir a introdução:", error.message);
            return [{
                table: {
                    body: [[
                        { 
                            text: "Erro ao carregar dados: " + error.message, 
                            fontSize: 12, 
                            color: "red", 
                            alignment: "center" 
                        }
                    ]]
                }
            }];
        }
    }
};