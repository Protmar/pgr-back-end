/* eslint-disable @typescript-eslint/no-var-requires */
const moment = require('moment');

moment.locale('pt-BR');

module.exports = {
  buildCapa: (cliente) => {
    const mesAno = moment().format("MMMM/YYYY");
    const mesAnoCamelCase = `${mesAno[0].toUpperCase()}${mesAno.slice(1)}`
  
    return {
      stack: [
        {
          margin: [0, 180, 0, 0],
          text: 'L.P – Laudo Técnico de Periculosidade',
          bold: true,
          alignment: 'center',
          fontSize: 30,
          lineHeight: 1,
          decoration: 'underline'
        },
        {
          margin: [60, 80, 60, 0],
          text: cliente.razao_social ? cliente.razao_social.toUpperCase() : '',
          bold: true,
          alignment: 'center',
          fontSize: 16
        },
        {
          margin: [60, 0, 60, 0],
          text: `C.N.P.J.: ${cliente.cnpj}`,
          bold: true,
          alignment: 'center',
          fontSize: 16
        },
        {
          margin: [60, 0, 60, 0],
          text: cliente.localizacao_completa,
          bold: true,
          alignment: 'center',
          fontSize: 16
        },
        {
          margin: [60, 120, 60, 0],
          text: mesAnoCamelCase,
          bold: true,
          alignment: 'center',
          fontSize: 16
        },
      ]
    }
  }
}