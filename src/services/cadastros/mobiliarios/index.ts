import { CadastroMobiliario } from "../../../models/Mobiliarios";

export const mobiliariosPostService = async (
  empresaId: string,
  descricao: string
) => {
  const data = await CadastroMobiliario.create({
    empresa_id: Number(empresaId),
    descricao,
  });

  return data;
};

export const mobiliariosGetAllService = async (empresaId: string) => {
  const data = await CadastroMobiliario.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const mobiliariosGetService = async (
  empresaId: string,
  idmobiliarios: string
) => {
  const data = await CadastroMobiliario.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idmobiliarios,
    },
  });

  return data;
};

export const mobiliariosDeleteService = (
  empresaId: string,
  idmobiliarios: string
) => {
  const data = CadastroMobiliario.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idmobiliarios,
    },
  });

  return data;
};

export const mobiliariosPutService = (
  empresaId: string,
  descricao: string,
  mobiliariosId: string
) => {
  const data = CadastroMobiliario.update(
    {
      descricao,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: mobiliariosId,
      },
    }
  );

  return data;
};
