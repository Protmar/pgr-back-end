import { CadastroParede } from "../../../models/Paredes";

export const paredePostService = async (
  empresaId: string,
  descricao: string
) => {
  const data = await CadastroParede.create({
    empresa_id: Number(empresaId),
    descricao,
  });

  return data;
};

export const paredeGetAllService = async (empresaId: string) => {
  const data = await CadastroParede.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const paredeGetService = async (empresaId: string, idparede: string) => {
  const data = await CadastroParede.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idparede,
    },
  });

  return data;
};

export const paredeDeleteService = (empresaId: string, idparede: string) => {
  const data = CadastroParede.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idparede,
    },
  });

  return data;
};

export const paredePutService = (
  empresaId: string,
  descricao: string,
  paredeId: string
) => {
  const data = CadastroParede.update(
    {
      descricao,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: paredeId,
      },
    }
  );

  return data;
};
