import { CadastroExigenciaAtividade } from "../../../models/ExigenciasAtividades";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const exigenciaAtividadePostService = async (empresaId: string, descricao: string) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroExigenciaAtividade.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const exigenciaAtividadeGetAllService = async (empresaId: string) => {
  const data = await CadastroExigenciaAtividade.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const exigenciaAtividadeGetService = async (empresaId: string, idexigenciaatividade: string) => {
  const data = await CadastroExigenciaAtividade.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idexigenciaatividade || "",
    },
  });

  return data;
};

export const exigenciaAtividadeDeleteService = (empresaId: string, idexigenciaatividade: string) => {
  const data = CadastroExigenciaAtividade.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idexigenciaatividade,
    },
  });

  return data;
};

export const exigenciaAtividadePutService = (
  empresaId: string,
  descricao: string,
  idexigenciaatividade: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroExigenciaAtividade.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: idexigenciaatividade,
      },
    }
  );

  return data;
};
