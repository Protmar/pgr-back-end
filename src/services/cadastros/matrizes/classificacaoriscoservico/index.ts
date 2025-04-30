import {
  ClassificacaoRiscoServico,
  ClassificacaoRiscoServicoAttributes,
} from "../../../../models/ClassificacaoRiscoServico";

export const classificacaoRiscoServicoPostService = async (
  params: ClassificacaoRiscoServicoAttributes
) => {
  const data = await ClassificacaoRiscoServico.create(params);
  return data;
};

export const classificacaoRiscoServicoGetAll = async (matrizId: string) => {
  const data = await ClassificacaoRiscoServico.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const classificacaoRiscoServicoGet = async (
  matrizId: string,
  classificacaoRiscoServicoId: string
) => {
  const data = await ClassificacaoRiscoServico.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: classificacaoRiscoServicoId,
    },
  });
  return data;
};

export const classificacaoRiscoServicoDelete = (
  matrizId: string,
  classificacaoRiscoServicoId: string
) => {
  const data = ClassificacaoRiscoServico.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: classificacaoRiscoServicoId,
    },
  });
  return data;
};

export const classificacaoRiscoServicoPut = (
  grauRisco: string,
  classeRisco: string,
  cor: string,
  definicao: string,
  classificacaoRiscoServicoId: string,
  matrizId: string,
  formaAtuacao: string
) => {
  const data = ClassificacaoRiscoServico.update(
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
        id: classificacaoRiscoServicoId,
      },
    }
  );

  return data;
};
