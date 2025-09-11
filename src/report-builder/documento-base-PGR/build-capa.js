/* eslint-disable @typescript-eslint/no-var-requires */
const moment = require('moment');
const { getDadosServicoByEmpresaServico } = require('../../services/servicos');

moment.locale('pt-BR');

module.exports = {
  buildCapa: async (cliente, servicoId, empresa) => {
    // busca dados do serviço
    const servico = await getDadosServicoByEmpresaServico(empresa.id, servicoId);

    // usa a data_inicial do serviço
    function formatDate(dateString) {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      
      if(month == "01") return `Janeiro/${year}`;
      if(month == "02") return `Fevereiro/${year}`;
      if(month == "03") return `Março/${year}`;
      if(month == "04") return `Abril/${year}`;
      if(month == "05") return `Maio/${year}`;
      if(month == "06") return `Junho/${year}`;
      if(month == "07") return `Julho/${year}`;
      if(month == "08") return `Agosto/${year}`;
      if(month == "09") return `Setembro/${year}`;
      if(month == "10") return `Outubro/${year}`;
      if(month == "11") return `Novembro/${year}`;
      if(month == "12") return `Dezembro/${year}`;
    }

    return {
      stack: [
        {
          margin: [0, 180, 0, 0],
          text: 'PGR – Programa de Gerenciamento de Riscos',
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
          text: formatDate(servico?.data_inicio),
          bold: true,
          alignment: 'center',
          fontSize: 16
        },
      ]
    }
  }
}
