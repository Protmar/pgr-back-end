import { CadastroFuncao } from "../../../models/Funcoes";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const funcaoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = await CadastroFuncao.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const funcaoGetAllService = async (empresaId: string) => {
  const data = await CadastroFuncao.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const funcaoGetService = async (empresaId: string, idfuncao: string) => {
  const data = await CadastroFuncao.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idfuncao,
    },
  });

  return data;
};

export const funcaoDeleteService = (empresaId: string, idfuncao: string) => {
  const data = CadastroFuncao.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idfuncao,
    },
  });

  return data;
};

export const funcaoPutService = (
  empresaId: string,
  descricao: string,
  idfuncao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroFuncao.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: idfuncao,
      },
    }
  );

  return data;
};
