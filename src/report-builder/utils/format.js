module.exports = {
  formatReal: (numero) => {
    if (numero === undefined || numero == null || isNaN(numero)) numero = 0;

    const separado = parseFloat(numero).toFixed(2).split(".");
    separado[0] = "R$ " + separado[0].split(/(?=(?:...)*$)/).join(".");

    return separado.join(",");
  },

  formatFator: (numero) => {
    if (numero === undefined) return numero;

    return parseFloat(numero).toLocaleString("pt-BR", {
      maximumFractionDigits: 4,
    });
  },
};
