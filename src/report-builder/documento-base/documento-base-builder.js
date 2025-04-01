/* eslint-disable @typescript-eslint/no-var-requires */
const { getImageData } = require("../utils/report-utils");
const { buildCapa } = require("./build-capa");
const { buildIntroducao } = require("./build-introducao");

module.exports = {
  buildDocumentoBase: async ({
    cliente,
    empresa,
    reportConfig,
    s3url,
  }) => {
    const logoCliente = await getImageData(
      reportConfig.noImageUrl
    );
    let logoClienteWidth = (logoCliente.width / logoCliente.height) * 50;
    if (logoClienteWidth > 100) logoClienteWidth = 100;

    const logoEmpresa = await getImageData(
      reportConfig.noImageUrl
    );
    let logoEmpresaWidth = (logoEmpresa.width / logoEmpresa.height) * 50;
    if (logoEmpresaWidth > 100) logoEmpresaWidth = 100;

    const docDefinitions = {
      defaultStyle: {
        font: "Calibri",
        fontSize: 12,
        lineHeight: 2,
      },
      pageSize: "A4",
      pageMargins: [50, 115, 50, 80],
      content: [
        buildCapa(cliente),
        await buildIntroducao(reportConfig)
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
              {
                border: [false, false, false, true],
                image: logoCliente.data,
                width: logoClienteWidth,
                alignment: "center",
              },
              {
                margin: 5,
                border: [true, false, true, true],
                text: "PROGRAMA DE GERENCIAMENTO DE RISCOS NO TRABALHO RURAL",
                bold: true,
                alignment: "center",
                fontSize: 12,
              },
              {
                border: [false, false, false, true],
                image: logoEmpresa.data,
                width: logoEmpresaWidth,
                alignment: "center",
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

    return docDefinitions;
  },
};
