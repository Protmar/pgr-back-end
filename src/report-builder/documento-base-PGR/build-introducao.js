/* eslint-disable @typescript-eslint/no-var-requires */
const { getOneGesService, getEpisInString } = require("../../services/ges");
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

      // Validação inicial
      if (!empresa?.dataValues?.id || !Array.isArray(gesIds) || !reportConfig?.noImageUrl) {
        throw new Error("Parâmetros inválidos fornecidos para buildIntroducao");
      }

      const gesDataArray = await Promise.all(
        gesIds.map((gesId) => getOneGesService(empresa.dataValues.id, gesId))
      );

      const tables = await Promise.all(
        gesDataArray.map(async (gesResponse, index) => {
          const ges = gesResponse?.dataValues;
          if (!ges) throw new Error(`Dados de GES não encontrados para ID: ${gesIds[index]}`);

          // Imagem base (placeholder)
          const imagemBase = await getImageData(reportConfig.noImageUrl);
          let imagem = null;

          // Tentativa de carregar fluxograma
          const nomeFluxograma = ges.nome_fluxograma || null;

          if (nomeFluxograma) {
            try {
              const fileInfo = await getFileToS3(nomeFluxograma);

              if (!fileInfo?.url || typeof fileInfo.url !== "string" || !fileInfo.url.startsWith("http")) {
                throw new Error(`URL inválida para fluxograma "${nomeFluxograma}": ${fileInfo?.url}`);
              }

              imagem = await getImageData(fileInfo.url);

              if (imagem?.type === "webp") {
                imagem.data = await convertToPng(imagem.data, 250);
              }
            } catch (err) {
              console.error(`Erro ao carregar imagem de fluxograma (GES ${ges.id}): ${err.message}`);
              imagem = null;
            }
          }

          const imageData = imagem?.data
            ? [
                {
                  image: imagem.data,
                  width: 250,
                  alignment: "center",
                  colSpan: 4,
                },
                {}, {}, {}
              ]
            : [];

          // EPIs obrigatórios
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
              console.error(`Erro ao carregar EPIs do GES ${ges.id}: ${err.message}`);
              return "• Equipamentos: erro ao carregar EPIs\n";
            }
          };

          const ambiente = ges.ambientesTrabalhos?.ambientesTrabalhos?.[0]?.dataValues || {};
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

          // Monta tabela principal
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

          if (imagem?.data) {
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

          return {
            stack: [
              createTitle(),
              {
                table: {
                  widths: ["10%", "30%", "30%", "*"],
                  body: tableBody,
                },
                layout: "centerPGR",
              },
            ],
            pageBreak: index < gesDataArray.length - 1 ? "after" : undefined,
          };
        })
      );

      return tables;
    } catch (error) {
      console.error("Erro ao montar introdução do documento:", error.message);
      return [
        {
          table: {
            body: [
              [
                {
                  text: `Erro ao carregar dados: ${error.message}`,
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
