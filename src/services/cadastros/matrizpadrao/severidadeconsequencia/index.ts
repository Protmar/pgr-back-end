import { SeveridadeConsequencia, SeveridadeConsequenciaCreationAttributes } from "../../../../models/SeveridadeConsequencia";


export const severidadeConsequenciaPostService = async (
  params: SeveridadeConsequenciaCreationAttributes
) => {
  const data = await SeveridadeConsequencia.create(params);
  return data;
};

export const severidadeConsequenciaGetAll = async (matrizId: string) => {
  const data = await SeveridadeConsequencia.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const severidadeConsequenciaGet = async (matrizId: string, severidadeConsequenciaId: string) => {
  const data = await SeveridadeConsequencia.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: severidadeConsequenciaId,
    },
  });
  return data;
};

export const severidadeConsequenciaDelete = (matrizId: string, severidadeConsequenciaId: string) => {
  const data = SeveridadeConsequencia.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: severidadeConsequenciaId,
    },
  });
  return data;
};

export const severidadeConsequenciaPut = (
  position: string,
  description: string,
  criterio: string,
  severidadeConsequenciaId: string,
  matrizId: string
) => {
  const data = SeveridadeConsequencia.update(
    {
      position: Number(position),
      description: description,
      criterio: criterio,
    },
    {
      where: {
        matriz_id: Number(matrizId),
        id: severidadeConsequenciaId,
      },
    }
  );

  return data;
};
