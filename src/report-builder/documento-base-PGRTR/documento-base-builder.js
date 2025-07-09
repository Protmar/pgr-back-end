/* eslint-disable @typescript-eslint/no-var-requires */
const { getFileToS3 } = require("../../services/aws/s3");
const { convertToPng } = require("../utils/image-utils");
const { getImageData } = require("../utils/report-utils");
const { buildCapa } = require("./build-capa");
const { buildGes } = require("./build-ges");
const { buildIntroducao } = require("./build-introducao");
const { buildRequisitos } = require("./build-requisitos");

module.exports = {
  buildDocumentoBase: async ({
    cliente,
    empresa,
    reportConfig,
    s3url,
    servicoId,
    gesIds
  }) => {

    const nomeLogo = cliente.dataValues.logo_url || null;

    const urlImageLogoCliente = await getFileToS3(nomeLogo);
    const urlImageLogoEmpresa = await getFileToS3(empresa.dataValues.logoUrl);


    const logoCliente = cliente.dataValues.logo_url ? (await getImageData(urlImageLogoCliente.url)) : (await getImageData(reportConfig.noImageUrl));
    let logoClienteWidth = (logoCliente.width / logoCliente.height) * 50;
    if (logoClienteWidth > 100) logoClienteWidth = 100;

    const logoEmpresa = cliente.dataValues.logo_url ? (await getImageData(urlImageLogoEmpresa.url)) : (await getImageData(reportConfig.noImageUrl));
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
        {
          stack: [
            buildCapa(cliente), // Página 1: Capa
            { text: '', pageBreak: 'before', pageOrientation: 'landscape' }, // Causa página em branco (página 2)
            await buildIntroducao(empresa, reportConfig, servicoId, gesIds), // Página 3: Introdução
            { text: '', pageBreak: 'before', pageOrientation: 'landscape' },
            await buildRequisitos(empresa, reportConfig, servicoId, gesIds), // Página 4: Requisitos
            { text: '', pageBreak: 'before', pageOrientation: 'landscape' },
            await buildGes(reportConfig, empresa, servicoId, gesIds), // Página 5: Ges
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
              {
                border: [false, false, false, true],
                image: logoCliente.data,
                width: logoClienteWidth,
                alignment: "center",
                margin: [0, 0, 0, 5],
              },
              {
                margin: [5, 15, 5, 0],
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

    return docDefinitions;
  },
};
