import { CadastroSetor } from "../../../models/Setores";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const setorPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroSetor.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const setorGetAllService = async (empresaId: string) => {
  const data = await CadastroSetor.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const setorGetService = async (empresaId: string, idsetor: string) => {
  const data = await CadastroSetor.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idsetor,
    },
  });

  return data;
};

export const setorDeleteService = (empresaId: string, idsetor: string) => {
  const data = CadastroSetor.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idsetor,
    },
  });

  return data;
};

export const setorPutService = (
  empresaId: string,
  descricao: string,
  setorId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroSetor.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: setorId,
      },
    }
  );

  return data;
};
