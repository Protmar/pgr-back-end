import { CadastroPiso } from "../../../models/Pisos";

export const pisoPostService = async (empresaId: string, descricao: string) => {
  const data = await CadastroPiso.create({
    empresa_id: Number(empresaId),
    descricao,
  });

  return data;
};

export const pisoGetAllService = async (empresaId: string) => {
  const data = await CadastroPiso.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const pisoGetService = async (empresaId: string, idpiso: string) => {
  const data = await CadastroPiso.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idpiso,
    },
  });

  return data;
};

export const pisoDeleteService = (empresaId: string, idpiso: string) => {
  const data = CadastroPiso.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idpiso,
    },
  });

  return data;
};

export const pisoPutService = (
  empresaId: string,
  descricao: string,
  pisoId: string
) => {
  const data = CadastroPiso.update(
    {
      descricao,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: pisoId,
      },
    }
  );

  return data;
};
