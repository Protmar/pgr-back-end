import { SeveridadeConsequenciaServico, SeveridadeConsequenciaServicoCreationAttributes } from "../../../../models/SeveridadeConsequenciaServico";


export const severidadeConsequenciaServicoPostService = async (
  params: SeveridadeConsequenciaServicoCreationAttributes
) => {
  const data = await SeveridadeConsequenciaServico.create(params);
  return data;
};

export const severidadeConsequenciaServicoGetAll = async (matrizId: string) => {
  const data = await SeveridadeConsequenciaServico.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const severidadeConsequenciaServicoGet = async (matrizId: string, severidadeConsequenciaServicoId: string) => {
  const data = await SeveridadeConsequenciaServico.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: severidadeConsequenciaServicoId,
    },
  });
  return data;
};

export const severidadeConsequenciaServicoDelete = (matrizId: string, severidadeConsequenciaServicoId: string) => {
  const data = SeveridadeConsequenciaServico.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: severidadeConsequenciaServicoId,
    },
  });
  return data;
};

export const severidadeConsequenciaServicoPut = (
  position: string,
  description: string,
  criterio: string,
  severidadeConsequenciaServicoId: string,
  matrizId: string
) => {
  const data = SeveridadeConsequenciaServico.update(
    {
      position: Number(position),
      description: description,
      criterio: criterio,
    },
    {
      where: {
        matriz_id: Number(matrizId),
        id: severidadeConsequenciaServicoId,
      },
    }
  );

  return data;
};
