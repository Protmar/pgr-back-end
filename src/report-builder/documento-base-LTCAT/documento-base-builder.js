/* eslint-disable @typescript-eslint/no-var-requires */
const { getFileToS3 } = require("../../services/aws/s3");
const { convertToPng } = require("../utils/image-utils");
const { getImageData } = require("../utils/report-utils");
const { buildCapa } = require("./build-capa");
const { buildLTCAT } = require("./build-ltcat");

module.exports = {
  buildDocumentoBase: async ({
    cliente,
    empresa,
    reportConfig,
    s3url,
    servicoId,
    gesIds
  }) => {

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

    const resultadoLTCAT = await buildLTCAT(empresa, servicoId, gesIds, cliente)

    const docDefinitions = {
      defaultStyle: {
        font: "Calibri",
        fontSize: 12,
        lineHeight: 2,
      },
      pageSize: "A4",
      pageMargins: [50, 115, 50, 80],
      content: [
        {
          stack: [
            buildCapa(cliente), // Página 1: Capa
            { text: '', pageBreak: 'before' },
            resultadoLTCAT.table

          ]
        }
      ],

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      background: (currentPage, pageSize) => {
        const margin = 25;
        const endWidth = pageSize.width - 25;
        const endHeight = pageSize.height - 25;

        return [
          {
            canvas: [
              {
                type: "line",
                x1: margin,
                y1: margin,
                x2: endWidth,
                y2: margin,
                lineWidth: 0.5,
              },
              {
                type: "line",
                x1: margin,
                y1: margin,
                x2: margin,
                y2: endHeight,
                lineWidth: 0.5,
              },
              {
                type: "line",
                x1: margin,
                y1: endHeight,
                x2: endWidth,
                y2: endHeight,
                lineWidth: 0.5,
              },
              {
                type: "line",
                x1: endWidth,
                y1: margin,
                x2: endWidth,
                y2: endHeight,
                lineWidth: 0.5,
              },
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
                margin: [5, 10, 5, 0],
                border: [true, false, true, true],
                text: "LAUDO TÉCNICO DE CONDIÇÕES AMBIENTAIS DE TRABALHO",
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      footer: (currentPage, pageCount) => {
        return {
          margin: [0, 30, 0, 0],
          text: currentPage,
          alignment: "center",
          fontSize: 18,
          bold: true,
          color: "#FFFFFF",
        };
      },
    };

    return { docDefinitions, resultadoLTCAT };
  },
};
