import { CadastroEdificacao } from "../../../models/Edificacoes";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const edificacaoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroEdificacao.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const edificacaoGetAllService = async (empresaId: string) => {
  const data = await CadastroEdificacao.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const edificacaoGetService = async (
  empresaId: string,
  edificacaoId: string
) => {
  const data = await CadastroEdificacao.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: edificacaoId,
    },
  });

  return data;
};

export const edificacaoDeleteService = (
  empresaId: string,
  edificacaoId: string
) => {
  const data = CadastroEdificacao.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: edificacaoId,
    },
  });

  return data;
};

export const edificacaoPutService = (
  empresaId: string,
  descricao: string,
  edificacaoId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroEdificacao.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: edificacaoId,
      },
    }
  );

  return data;
};
