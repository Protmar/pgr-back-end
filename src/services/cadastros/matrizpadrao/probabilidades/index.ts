import {

  Probabilidade,
  ProbabilidadeCreationAttributes,
} from "../../../../models/Probabilidades";

export const probabilidadePostService = async (
  params: ProbabilidadeCreationAttributes
) => {
  const data = await Probabilidade.create(params);
  return data;
};

export const probabilidadeGetAll = async (matrizId: string) => {
  const data = await Probabilidade.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const probabilidadeGet = async (matrizId: string, probabilidadeId: string) => {
  const data = await Probabilidade.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: probabilidadeId,
    },
  });
  return data;
};

export const probabilidadeDelete = (matrizId: string, probabilidadeId: string) => {
  const data = Probabilidade.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: probabilidadeId,
    },
  });
  return data;
};

export const probabilidadePut = (
  position: string,
  description: string,
  criterio: string,
  probabilidadeId: string,
  matrizId: string,
  sinal:string,
  valor:string,
  sem_protecao:boolean
) => {
  const data = Probabilidade.update(
    {
      position: Number(position),
      description: description,
      criterio: criterio,
      sinal: sinal,
      valor: valor,
      sem_protecao: sem_protecao
    },
    {
      where: {
        matriz_id: Number(matrizId),
        id: probabilidadeId,
      },
    }
  );

  return data;
};
