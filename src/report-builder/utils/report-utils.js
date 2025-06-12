/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
const PdfPrinter = require("pdfmake");
const pdfLib = require("pdf-lib");
const https = require("https");
const sizeOf = require("image-size");
const Sharp = require("sharp");
const sharp = require('sharp');

axios.defaults.timeout = 60000;
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

module.exports = {
  generatePdf: (docDefinitions) => {
    return new Promise((resolve, reject) => {
      getPdf(docDefinitions, (error, buffer) => {
        if (error) {
          reject(error);
        } else {
          resolve(buffer);
        }
      });
    });
  },

  getImageFromData: (data) => {
    const img = Buffer.from(
      data.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const dimensions = sizeOf(img);
    return {
      data,
      ...dimensions,
    };
  },

  getImageData: async (url, maxWidth, maxHeight) => {
    const result = await axios.get(url, { responseType: "arraybuffer" });
    let img = Buffer.from(result.data);
    let dimensions = sizeOf(img);

    if (dimensions.orientation) {
      img = await Sharp(img).rotate().toBuffer();
      dimensions = sizeOf(img);
    }

    if (maxWidth && dimensions.width > maxWidth) {
      img = await Sharp(img).resize({ width: maxWidth }).toBuffer();
      dimensions = sizeOf(img);
    }

    if (maxHeight && dimensions.height > maxHeight) {
      img = await Sharp(img).resize({ height: maxHeight }).toBuffer();
      dimensions = sizeOf(img);
    }

    return {
      data: `data:${result.headers["content-type"]};base64,${img.toString(
        "base64"
      )}`,
      ...dimensions,
    };
  },

  getFileFromUrl: async (url) => {
    const result = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
    });
    return Buffer.from(result.data);
  },

  appendFileOnPdf: async (pdfDocument, bufferFile) => {
    const pdf = await pdfLib.PDFDocument.load(bufferFile);
    const copiedPagesEquipamento = await pdfDocument.copyPages(
      pdf,
      pdf.getPageIndices()
    );
    copiedPagesEquipamento.forEach((page) => {
      pdfDocument.addPage(page);
    });

    return pdfDocument;
  },
};

const getPdf = (docDefinitions, cb) => {
  const printer = new PdfPrinter(fonts);

  const pdfDoc = printer.createPdfKitDocument(docDefinitions, { tableLayouts });

  const chunks = [];
  let result;

  pdfDoc.on("data", (chunk) => chunks.push(chunk));
  pdfDoc.on("end", () => {
    result = Buffer.concat(chunks);
    cb(null, result);
  });
  pdfDoc.on("error", cb);
  pdfDoc.end();
};

const fonts = {
  Calibri: {
    normal: "src/report-builder/fonts/Calibri-Regular.ttf",
    bold: "src/report-builder/fonts/Calibri-Bold.ttf",
    italics: "src/report-builder/fonts/Calibri-Italic.ttf",
    bolditalics: "src/report-builder/fonts/Calibri-Bold-Italic.ttf",
  },
};

const tableLayouts = {
  centerPerigoText: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerPerigoVertically(node, index);
      return 2;
    },
  },
  centerHrnText: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerHrnVertically(node, index);
      return 2;
    },
  },
  centerPlanoAcaoText: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerPlanoAcaoVertically(node, index);
      return 2;
    },
  },
  centerOrcamentoText: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerOrcamentoVertically(node, index);
      return 2;
    },
  },
  centerMultaText: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerMultaVertically(node, index);
      return 2;
    },
  },
  centerChecklistText: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerChecklistVertically(node, index);
      return 2;
    },
  },

  centerPGR: {
    paddingTop: (index, node) => {
      centerLTCATVertically(node, index);
      return 2;
    },

    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    paddingLeft: () => 0,
    paddingRight: () => 0,

    hLineColor: () => '#D3D3D3', // cor para linhas horizontais

    vLineColor: (i, node) => {
      // Apenas extremidades verticais pretas
      const isFirst = i === 0;
      const isLast = i === node.table.widths.length;
      return isFirst || isLast ? '#000000' : '#D3D3D3'; // internas cinza claro
    }
  },

  centerPGR2: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerLTCATVertically(node, index);
      return 2;
    },

    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    hLineColor: () => "black",
    vLineColor: () => "#D3D3D3"
  },

  centerPGR3: {
    paddingTop: (index, node) => {
      centerLTCATVertically(node, index);
      return 2;
    },

    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    paddingLeft: () => 0,
    paddingRight: () => 0,

    hLineColor: () => '#000000', // cor para linhas horizontais

    vLineColor: (i, node) => {
      // Apenas extremidades verticais pretas
      const isFirst = i === 0;
      const isLast = i === node.table.widths.length;
      return isFirst || isLast ? '#000000' : '#000000'; // internas cinza claro
    }
  },

  centerPGRTR: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerLTCATVertically(node, index);
      return 2;
    },
  },

  centerLTCAT: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paddingTop: (index, node) => {
      centerLTCATVertically(node, index);
      return 2;
    },
  },
};



const calcCellHeightByText = (inlines, maxWidth) => {
  if (!inlines) return 0;
  let height = 0;
  let usedWidth = 0;
  for (const line of inlines) {
    usedWidth += line.width;
    if (usedWidth > maxWidth) {
      height += line.height;
      usedWidth = line.width;
    } else {
      height = Math.max(line.height, height);
    }
  }

  return height;
};

const centerPerigoVertically = (node, rowIndex) => {
  if (rowIndex === 2) {
    centerAllColumns(node, rowIndex);
  }
};

const centerHrnVertically = (node, rowIndex) => {
  //Na linha de índice 2, deve-se centralizar as células com rowSpan = 4: Descrição dos planos de ação e categoria de segurança
  if (rowIndex === 2) {
    const categoriaSegurancaHeight = calcCellHeightByText(
      node.table.body[rowIndex][6]._inlines,
      node.table.widths[6]._calcWidth
    );
    const plrHeight = calcCellHeightByText(
      node.table.body[rowIndex][7]._inlines,
      node.table.widths[7]._calcWidth
    );
    const silHeight = calcCellHeightByText(
      node.table.body[rowIndex][8]._inlines,
      node.table.widths[8]._calcWidth
    );
    const fatoresHrnHeight = 48;

    const maxHeight = Math.max(
      categoriaSegurancaHeight,
      plrHeight,
      silHeight,
      fatoresHrnHeight
    );

    if (categoriaSegurancaHeight < maxHeight) {
      const marginTop = (maxHeight - categoriaSegurancaHeight) / 2;
      node.table.body[rowIndex][6]._margin = [0, marginTop, 0, 0];
    }

    if (plrHeight < maxHeight) {
      const marginTop = (maxHeight - plrHeight) / 2;
      node.table.body[rowIndex][7]._margin = [0, marginTop, 0, 0];
    }

    if (silHeight < maxHeight) {
      const marginTop = (maxHeight - silHeight) / 2;
      node.table.body[rowIndex][8]._margin = [0, marginTop, 0, 0];
    }
  }

  //Na linha de índice 5, deve-se centralizar os fatores HRN se a altura total for maior que o mínimo
  if (rowIndex === 5) {
    const minMargemSeq = 19;
    const usedMarginSeq = node.table.body[2][8]._margin[1];

    if (usedMarginSeq > minMargemSeq) {
      const marginTop = usedMarginSeq - minMargemSeq;
      node.table.body[rowIndex].forEach((cell, ci) => {
        if (ci >= 0 && ci <= 5) {
          cell._margin = [0, marginTop, 0, 0];
        }
      });
    }
  }
};

const centerAllColumns = (node, rowIndex) => {
  const allHeights = node.table.body[rowIndex].map((cell, cellIndex) => {
    return calcCellHeightByText(
      cell._inlines,
      node.table.widths[cellIndex]._calcWidth
    );
  });

  const maxHeight = Math.max(...allHeights);

  node.table.body[rowIndex].forEach((cell, cellIndex) => {
    if (allHeights[cellIndex] < maxHeight) {
      const marginTop = (maxHeight - allHeights[cellIndex]) / 2;
      cell._margin = [0, marginTop, 0, 0];
    }
  });
};

const centerLTCATVertically = (node, rowIndex) => {
  //Na linha de índice 1, deve-se centralizar todas as células
  centerAllColumns(node, rowIndex);
};

const centerPlanoAcaoVertically = (node, rowIndex) => {
  //Na linha de índice 1, deve-se centralizar todas as células
  if (rowIndex === 1) {
    centerAllColumns(node, rowIndex);
  }
};

const centerOrcamentoVertically = (node, rowIndex) => {
  if (rowIndex === 1 || rowIndex === 3) {
    centerAllColumns(node, rowIndex);
  }

  if (rowIndex === 2) {
    const descricaoMateriaisHeight = calcCellHeightByText(
      node.table.body[rowIndex][0]._inlines,
      node.table.widths[0]._calcWidth
    );
    const valorMateriaisHeight = calcCellHeightByText(
      node.table.body[rowIndex][2]._inlines,
      node.table.widths[2]._calcWidth
    );
    const materiaisHeight =
      (node.table.body[rowIndex][1]._inlines.filter((line) => line.lineEnd)
        .length || 0) * 10;

    if (descricaoMateriaisHeight < materiaisHeight) {
      const marginTop = (materiaisHeight - descricaoMateriaisHeight) / 2;
      node.table.body[rowIndex][0]._margin = [0, marginTop, 0, 0];
    }

    if (valorMateriaisHeight < materiaisHeight) {
      const marginTop = (materiaisHeight - valorMateriaisHeight) / 2;
      node.table.body[rowIndex][2]._margin = [0, marginTop, 0, 0];
    }
  }
};

const centerMultaVertically = (node, rowIndex) => {
  if (rowIndex === 0) {
    centerAllColumns(node, rowIndex);
  }
};

const centerChecklistVertically = (node, rowIndex) => {
  if (rowIndex <= 29) {
    centerAllColumns(node, rowIndex);
  }
};