import { CadastroIluminacao } from "../../../models/Iluminacoes";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const iluminacaoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroIluminacao.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const iluminacaoGetAllService = async (empresaId: string) => {
  const data = await CadastroIluminacao.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const iluminacaoGetService = async (
  empresaId: string,
  iluminacaoId: string
) => {
  const data = await CadastroIluminacao.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: iluminacaoId,
    },
  });

  return data;
};

export const iluminacaoDeleteService = (
  empresaId: string,
  iluminacaoId: string
) => {
  const data = CadastroIluminacao.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: iluminacaoId,
    },
  });

  return data;
};

export const iluminacaoPutService = (
  empresaId: string,
  descricao: string,
  iluminacaoId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroIluminacao.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: iluminacaoId,
      },
    }
  );

  return data;
};
