import {
  ClassificacaoRisco,
  ClassificacaoRiscoAttributes,
} from "../../../../models/ClassificacaoRisco";

export const classificacaoRiscoPostService = async (
  params: ClassificacaoRiscoAttributes
) => {
  const data = await ClassificacaoRisco.create(params);
  return data;
};

export const classificacaoRiscoGetAll = async (matrizId: string) => {
  const data = await ClassificacaoRisco.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const classificacaoRiscoGet = async (
  matrizId: string,
  classificacaoRiscoId: string
) => {
  const data = await ClassificacaoRisco.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: classificacaoRiscoId,
    },
  });
  return data;
};

export const classificacaoRiscoDelete = (
  matrizId: string,
  classificacaoRiscoId: string
) => {
  const data = ClassificacaoRisco.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: classificacaoRiscoId,
    },
  });
  return data;
};

export const classificacaoRiscoPut = (
  grauRisco: string,
  classeRisco: string,
  cor: string,
  definicao: string,
  classificacaoRiscoId: string,
  matrizId: string,
  formaAtuacao: string
) => {
  const data = ClassificacaoRisco.update(
    {
      grau_risco: Number(grauRisco),
      classe_risco: classeRisco,
      cor: cor,
      definicao: definicao,
      forma_atuacao: formaAtuacao,
    },
    {
      where: {
        matriz_id: Number(matrizId),
        id: classificacaoRiscoId,
      },
    }
  );

  return data;
};
