import { CadastroMedidaDeControle } from "../../../models/MedidasDeControles";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const medidaDeControlePostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroMedidaDeControle.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const medidaDeControleGetAllService = async (empresaId: string) => {
  const data = await CadastroMedidaDeControle.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const medidaDeControleGetService = async (
  empresaId: string,
  idmedidadecontrole: string
) => {
  const data = await CadastroMedidaDeControle.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idmedidadecontrole,
    },
  });

  return data;
};

export const medidaDeControleDeleteService = (
  empresaId: string,
  idmedidadecontrole: string
) => {
  const data = CadastroMedidaDeControle.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idmedidadecontrole,
    },
  });

  return data;
};

export const medidaDeControlePutService = (
  empresaId: string,
  descricao: string,
  medidadecontroleId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroMedidaDeControle.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: medidadecontroleId,
      },
    }
  );

  return data;
};
