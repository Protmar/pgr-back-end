/* eslint-disable @typescript-eslint/no-var-requires */
const { getFileToS3 } = require("../../services/aws/s3");
const { convertToPng } = require("../utils/image-utils");
const { getImageData } = require("../utils/report-utils");
const { buildCapa } = require("./build-capa");
const { buildLP } = require("./build-lp.js");

function getScaledImage(image, maxSize, cellHeight) {
  if (!image?.width || !image?.height) {
    return {
      image: image?.data || "",
      width: maxSize,
      height: maxSize,
      alignment: "center",
      margin: [0, 0, 0, 0],
    };
  }

  const ratio = Math.min(maxSize / image.width, maxSize / image.height);
  const newWidth = image.width * ratio;
  const newHeight = image.height * ratio;
  const verticalMargin = (cellHeight - newHeight) / 2;

  return {
    image: image.data,
    width: newWidth,
    height: newHeight,
    alignment: "center",
    margin: [0, verticalMargin, 0, 0],
    border: [false, false, false, true],
  };
}

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

    const resultadoLP = await buildLP(empresa, servicoId, gesIds, cliente)

    const docDefinitions = {
      defaultStyle: {
        font: "Calibri",
        fontSize: 12,
        lineHeight: 2,
      },
      pageSize: "A4",
      pageMargins: [25, 115, 25, 80],
      content: [
        {
          stack: [
            await buildCapa(cliente, servicoId, empresa), // Página 1: Capa
            { text: '', pageBreak: 'before' },
            resultadoLP.body

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
        margin: [35, 35, 35, 0],
        table: {
          widths: [100, "*", 100],
          body: [
            [
              logoCliente?.data
                ? getScaledImage(logoCliente, 80, 60)
                : { canvas: [{ type: "rect", x: 0, y: 0, w: 50, h: 50, color: "#ffffff" }], alignment: "center" },
              {
                border: [true, false, true, true],
                text: "LAUDO TÉCNICO DE PERICULOSIDADE",
                bold: true,
                alignment: "center",
                fontSize: 12,
                margin: [5, 20, 5, 0],
              },
              logoEmpresa?.data
                ? getScaledImage(logoEmpresa, 80, 60)
                : { canvas: [{ type: "rect", x: 0, y: 0, w: 50, h: 50, color: "#ffffff" }], alignment: "center" },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        heights: 60,
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

    return { docDefinitions, resultadoLP };
  },
};
