import { CadastroMedidaControleIndividualExistente } from "../../../../models/MedidaControleIndividualExistente";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const individualExistentePostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroMedidaControleIndividualExistente.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const individualExistenteGetAllService = async (empresaId: string) => {
  const data = await CadastroMedidaControleIndividualExistente.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const individualExistenteGetService = async (
  empresaId: string,
  individualexistente: string
) => {
  const data = await CadastroMedidaControleIndividualExistente.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: individualexistente,
    },
  });

  return data;
};

export const individualExistenteDeleteService = (
  empresaId: string,
  individualexistente: string
) => {
  const data = CadastroMedidaControleIndividualExistente.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: individualexistente,
    },
  });

  return data;
};

export const individualExistentePutService = (
  empresaId: string,
  descricao: string,
  individualexistenteId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroMedidaControleIndividualExistente.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: individualexistenteId,
      },
    }
  );

  return data;
};
