import { CadastroEstrategiaAmostragem } from "../../../models/EstrategiaAmostragem";


const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};
export const estrategiaAmostragemPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = await CadastroEstrategiaAmostragem.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const estrategiaAmostragemGetAllService = async (empresaId: string) => {
  const data = await CadastroEstrategiaAmostragem.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const estrategiaAmostragemGetService = async (
  empresaId: string,
  idestrategiaAmostragem: string
) => {
  const data = await CadastroEstrategiaAmostragem.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idestrategiaAmostragem,
    },
  });

  return data;
};

export const estrategiaAmostragemDeleteService = (
  empresaId: string,
  idestrategiaAmostragem: string
) => {
  const data = CadastroEstrategiaAmostragem.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idestrategiaAmostragem,
    },
  });

  return data;
};

export const estrategiaAmostragemPutService = (
  empresaId: string,
  descricao: string,
  estrategiaAmostragemId: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroEstrategiaAmostragem.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: estrategiaAmostragemId,
      },
    }
  );

  return data;
};
