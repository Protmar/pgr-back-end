import { CadastroMedidaControleAdministrativaExistente } from "../../../../models/MedidaControleAdministrativaExistente";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const administrativaExistentePostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroMedidaControleAdministrativaExistente.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const administrativaExistenteGetAllService = async (
  empresaId: string
) => {
  const data = await CadastroMedidaControleAdministrativaExistente.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const administrativaExistenteGetService = async (
  empresaId: string,
  administrativaexistente: string
) => {
  const data = await CadastroMedidaControleAdministrativaExistente.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: administrativaexistente,
    },
  });

  return data;
};

export const administrativaExistenteDeleteService = (
  empresaId: string,
  administrativaexistente: string
) => {
  const data = CadastroMedidaControleAdministrativaExistente.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: administrativaexistente,
    },
  });

  return data;
};

export const administrativaExistentePutService = (
  empresaId: string,
  descricao: string,
  administrativaexistenteId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroMedidaControleAdministrativaExistente.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: administrativaexistenteId,
      },
    }
  );

  return data;
};
