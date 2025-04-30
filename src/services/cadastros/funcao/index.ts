import { CadastroFuncao } from "../../../models/Funcoes";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const funcaoPostService = async (
  empresaId: string,
  returnData: any
) => {
  const descricaoFormatada = formatarNome(returnData.descricao);


  const dadoExistente = await CadastroFuncao.findOne({
    where: {
      funcao: returnData.funcao,
      empresa_id: Number(empresaId),
    },
  });

  if (dadoExistente) {
    return { success: false, error: "Função com essa Função já cadastrado." };
  }

  const data = await CadastroFuncao.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
    funcao: returnData.funcao,
    cbo: returnData.cbo,
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
  cbo: string,
  funcao: string,
  idfuncao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroFuncao.update(
    {
      descricao: descricaoFormatada,
      cbo: cbo,
      funcao
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
