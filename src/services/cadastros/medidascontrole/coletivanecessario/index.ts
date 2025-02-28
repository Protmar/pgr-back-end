import { CadastroMedidaControleColetivaNecessaria } from "../../../../models/MedidaControleColetivaNecessaria";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const coletivaNecessariaPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroMedidaControleColetivaNecessaria.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const coletivaNecessariaGetAllService = async (empresaId: string) => {
  const data = await CadastroMedidaControleColetivaNecessaria.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const coletivaNecessariaGetService = async (
  empresaId: string,
  coletivanecessaria: string
) => {
  const data = await CadastroMedidaControleColetivaNecessaria.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: coletivanecessaria,
    },
  });

  return data;
};

export const coletivaNecessariaDeleteService = (
  empresaId: string,
  coletivanecessaria: string
) => {
  const data = CadastroMedidaControleColetivaNecessaria.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: coletivanecessaria,
    },
  });

  return data;
};

export const coletivaNecessariaPutService = (
  empresaId: string,
  descricao: string,
  coletivanecessariaId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroMedidaControleColetivaNecessaria.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: coletivanecessariaId,
      },
    }
  );

  return data;
};
