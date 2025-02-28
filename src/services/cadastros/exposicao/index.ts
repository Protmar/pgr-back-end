import { CadastroExposicao } from "../../../models/Exposicoes";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};
export const exposicaoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = await CadastroExposicao.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const exposicaoGetAllService = async (empresaId: string) => {
  const data = await CadastroExposicao.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const exposicaoGetService = async (
  empresaId: string,
  idexposicao: string
) => {
  const data = await CadastroExposicao.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idexposicao,
    },
  });

  return data;
};

export const exposicaoDeleteService = (
  empresaId: string,
  idexposicao: string
) => {
  const data = CadastroExposicao.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idexposicao,
    },
  });

  return data;
};

export const exposicaoPutService = (
  empresaId: string,
  descricao: string,
  exposicaoId: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroExposicao.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: exposicaoId,
      },
    }
  );

  return data;
};
