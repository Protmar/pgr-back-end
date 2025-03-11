import {
  Parametro,
  ParametroCreationAttributes,
} from "../../../../models/Parametro";

export const parametroPostService = async (
  params: ParametroCreationAttributes
) => {
  const data = await Parametro.create(params);
  return data;
};

export const parametroGetAll = async (matrizId: string) => {
  const data = await Parametro.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const parametroGet = async (matrizId: string, parametroId: string) => {
  const data = await Parametro.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: parametroId,
    },
  });
  return data;
};

export const parametroDelete = (matrizId: string, parametroId: string) => {
  const data = Parametro.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: parametroId,
    },
  });
  return data;
};

export const parametroPut = (
  position: string,
  description: string,
  criterio: string,
  parametroId: string,
  matrizId: string
) => {
  const data = Parametro.update(
    {
      position: Number(position),
      description: description,
      criterio: criterio,
    },
    {
      where: {
        matriz_id: Number(matrizId),
        id: parametroId,
      },
    }
  );

  return data;
};
