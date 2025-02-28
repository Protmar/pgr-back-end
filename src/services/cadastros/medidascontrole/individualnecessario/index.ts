import { CadastroMedidaControleIndividualNecessaria } from "../../../../models/MedidaControleIndividualNecessaria";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const individualNecessariaPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroMedidaControleIndividualNecessaria.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const individualNecessariaGetAllService = async (empresaId: string) => {
  const data = await CadastroMedidaControleIndividualNecessaria.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const individualNecessariaGetService = async (
  empresaId: string,
  individualnecessaria: string
) => {
  const data = await CadastroMedidaControleIndividualNecessaria.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: individualnecessaria,
    },
  });

  return data;
};

export const individualNecessariaDeleteService = (
  empresaId: string,
  individualnecessaria: string
) => {
  const data = CadastroMedidaControleIndividualNecessaria.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: individualnecessaria,
    },
  });

  return data;
};

export const individualNecessariaPutService = (
  empresaId: string,
  descricao: string,
  individualnecessariaId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroMedidaControleIndividualNecessaria.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: individualnecessariaId,
      },
    }
  );

  return data;
};
