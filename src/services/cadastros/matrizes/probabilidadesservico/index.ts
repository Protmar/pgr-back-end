import { ProbabilidadeServico, ProbabilidadeServicoCreationAttributes } from "../../../../models/ProbabildadesServicos";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const probabilidadeServicoPostService = async (
  params: ProbabilidadeServicoCreationAttributes
) => {
  const descricaoFormatada = {...params, description: formatarNome(params.description)};
  const data = await ProbabilidadeServico.create(descricaoFormatada);
  return data;
};

export const probabilidadeServicoGetAll = async (matrizId: string) => {
  const data = await ProbabilidadeServico.findAll({
    where: {
      matriz_id: Number(matrizId),
    },
  });
  return data;
};

export const probabilidadeServicoGet = async (matrizId: string, probabilidadeServicoId: string) => {
  const data = await ProbabilidadeServico.findOne({
    where: {
      matriz_id: Number(matrizId),
      id: probabilidadeServicoId,
    },
  });
  return data;
};

export const probabilidadeServicoDelete = (matrizId: string, probabilidadeServicoId: string) => {
  const data = ProbabilidadeServico.destroy({
    where: {
      matriz_id: Number(matrizId),
      id: probabilidadeServicoId,
    },
  });
  return data;
};

export const probabilidadeServicoPut = (
  position: string,
  description: string,
  criterio: string,
  probabilidadeServicoId: string,
  matrizId: string,
  sinal:string,
  valor:string,
  sem_protecao:boolean
) => {
  const data = ProbabilidadeServico.update(
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
        id: probabilidadeServicoId,
      },
    }
  );

  return data;
};
