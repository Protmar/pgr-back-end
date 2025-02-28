import { CadastroVentilacao } from "../../../models/Ventilacoes";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const ventilacaoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroVentilacao.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const ventilacaoGetAllService = async (empresaId: string) => {
  const data = await CadastroVentilacao.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const ventilacaoGetService = async (
  empresaId: string,
  ventilacaoId: string
) => {
  const data = await CadastroVentilacao.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: ventilacaoId,
    },
  });

  return data;
};

export const ventilacaoDeleteService = (
  empresaId: string,
  ventilacaoId: string
) => {
  const data = CadastroVentilacao.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: ventilacaoId,
    },
  });

  return data;
};

export const ventilacaoPutService = (
  empresaId: string,
  descricao: string,
  ventilacaoId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroVentilacao.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: ventilacaoId,
      },
    }
  );

  return data;
};
