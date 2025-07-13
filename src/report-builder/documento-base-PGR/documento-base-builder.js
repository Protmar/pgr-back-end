/* eslint-disable @typescript-eslint/no-var-requires */
const { getFileToS3 } = require("../../services/aws/s3");
const { buildDocBase } = require("../documento-base-general-pgr/build-doc-base-pgr");
const { getImageData } = require("../utils/report-utils");
const { buildCapa } = require("./build-capa");
const { buildGes } = require("./build-ges");
const { buildIntroducao } = require("./build-introducao");
const { buildInventarioRiscos } = require("./build-inventario-riscos");
const { buildPlanoAcao } = require("./build-plano-acao");
const { buildRequisitos } = require("./build-requisitos");

module.exports = {
  buildDocumentoBase: async ({
    cliente,
    empresa,
    reportConfig,
    s3url,
    servicoId,
    gesIds,
  }) => {
    try {
      // === Logo Cliente ===
      let logoCliente = null;
      let logoClienteWidth = 50;
      let logoClienteHeight = 50; // Altura fixa para manter espaço

      try {
        const nomeLogo = cliente?.dataValues?.logo_url;
        const logoClienteS3 = nomeLogo ? await getFileToS3(nomeLogo) : null;
        logoCliente = await getImageData(logoClienteS3?.url);

        logoClienteWidth = (logoCliente.width / logoCliente.height) * 50;
        if (logoClienteWidth > 100) logoClienteWidth = 100;
        logoClienteHeight = 50;
      } catch (err) {
        console.error("Erro ao carregar logo do cliente. Usando espaço vazio:", err);
        logoCliente = { data: "", width: 50, height: 50 };
        logoClienteWidth = 50;
        logoClienteHeight = 50;
      }

      // === Logo Empresa ===
      let logoEmpresa = null;
      let logoEmpresaWidth = 50;
      let logoEmpresaHeight = 50;

      try {
        const nomeLogoEmpresa = empresa?.dataValues?.logoUrl;
        const logoEmpresaS3 = nomeLogoEmpresa ? await getFileToS3(nomeLogoEmpresa) : null;
        logoEmpresa = await getImageData(logoEmpresaS3?.url);

        logoEmpresaWidth = (logoEmpresa.width / logoEmpresa.height) * 50;
        if (logoEmpresaWidth > 100) logoEmpresaWidth = 100;
        logoEmpresaHeight = 50;
      } catch (err) {
        console.error("Erro ao carregar logo da empresa. Usando espaço vazio:", err);
        logoEmpresa = { data: "", width: 50, height: 50 };
        logoEmpresaWidth = 50;
        logoEmpresaHeight = 50;
      }

      // === Seções do Documento ===
      const [introducao, requisitos, ges, inventarioRiscos, planoAcao] = await Promise.all([
        buildIntroducao(empresa, reportConfig, servicoId, gesIds).catch((e) => {
          console.error("Erro em buildIntroducao:", e);
          return null;
        }),
        buildRequisitos(empresa, reportConfig, servicoId, gesIds).catch((e) => {
          console.error("Erro em buildRequisitos:", e);
          return null;
        }),
        buildGes(reportConfig, empresa, servicoId, gesIds).catch((e) => {
          console.error("Erro em buildGes:", e);
          return null;
        }),
        buildInventarioRiscos(reportConfig, empresa, servicoId, gesIds, cliente).catch((e) => {
          console.error("Erro em buildInventarioRiscos:", e);
          return null;
        }),
        buildPlanoAcao(reportConfig, empresa, servicoId, gesIds, cliente).catch((e) => {
          console.error("Erro em buildPlanoAcao:", e);
          return null;
        }),
      ]);

      const content = [buildCapa(cliente)];

      const addSection = (section) => {
        if (section && (Array.isArray(section) ? section.length > 0 : true)) {
          content.push({ text: "", pageBreak: "before", pageOrientation: "landscape" });
          content.push(section);
        }
      };

      addSection(introducao);
      addSection(requisitos);
      addSection(ges);
      addSection(inventarioRiscos);
      addSection(planoAcao);

      const docDefinitions = {
        defaultStyle: {
          font: "Calibri",
          fontSize: 12,
          lineHeight: 2,
        },
        pageSize: "A4",
        pageMargins: [25, 115, 25, 80],
        content: [{ stack: content }],
        background: (currentPage, pageSize) => {
          const margin = 25;
          const endWidth = pageSize.width - 25;
          const endHeight = pageSize.height - 25;

          return [
            {
              canvas: [
                { type: "line", x1: margin, y1: margin, x2: endWidth, y2: margin, lineWidth: 0.5 },
                { type: "line", x1: margin, y1: margin, x2: margin, y2: endHeight, lineWidth: 0.5 },
                { type: "line", x1: margin, y1: endHeight, x2: endWidth, y2: endHeight, lineWidth: 0.5 },
                { type: "line", x1: endWidth, y1: margin, x2: endWidth, y2: endHeight, lineWidth: 0.5 },
                {
                  type: "ellipse",
                  x: pageSize.width / 2,
                  y: endHeight - 10,
                  color: "#40618b",
                  fillOpacity: 0.75,
                  r1: 25,
                  r2: 25,
                },
              ],
            },
          ];
        },
        header: {
          margin: [50, 35, 50, 0],
          table: {
            widths: [100, "*", 100],
            body: [
              [
                logoCliente?.data
                  ? {
                    border: [false, false, false, true],
                    image: logoCliente.data,
                    width: logoClienteWidth,
                    height: logoClienteHeight,
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                  }
                  : {
                    border: [false, false, false, true],
                    canvas: [
                      {
                        type: "rect",
                        x: 0,
                        y: 0,
                        w: 50,
                        h: 50,
                        color: "#ffffff", // cor branca para deixar invisível
                      },
                    ],
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                  },
                {
                  margin: [5, 15, 5, 0],
                  border: [true, false, true, true],
                  text: "PROGRAMA DE GERENCIAMENTO DE RISCOS",
                  bold: true,
                  alignment: "center",
                  fontSize: 12,
                },
                logoEmpresa?.data
                  ? {
                    border: [false, false, false, true],
                    image: logoEmpresa.data,
                    width: logoEmpresaWidth,
                    height: logoEmpresaHeight,
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                  }
                  : {
                    border: [false, false, false, true],
                    canvas: [
                      {
                        type: "rect",
                        x: 0,
                        y: 0,
                        w: 50,
                        h: 50,
                        color: "#ffffff",
                      },
                    ],
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                  },
              ],
            ],
          },
        },
        footer: (currentPage, pageCount) => ({
          margin: [0, 30, 0, 0],
          text: currentPage,
          alignment: "center",
          fontSize: 18,
          bold: true,
          color: "#FFFFFF",
        }),
      };

      return docDefinitions;
    } catch (error) {
      console.error("Erro ao montar documento base:", error);
      return null;
    }
  },
};
