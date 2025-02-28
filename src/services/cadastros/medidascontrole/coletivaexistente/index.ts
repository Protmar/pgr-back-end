import { CadastroMedidaControleColetivaExistente } from "../../../../models/MedidaControleColetivaExistente";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const coletivaExistentePostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroMedidaControleColetivaExistente.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const coletivaExistenteGetAllService = async (empresaId: string) => {
  const data = await CadastroMedidaControleColetivaExistente.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const coletivaExistenteGetService = async (
  empresaId: string,
  coletivaexistente: string
) => {
  const data = await CadastroMedidaControleColetivaExistente.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: coletivaexistente,
    },
  });

  return data;
};

export const coletivaExistenteDeleteService = (
  empresaId: string,
  coletivaexistente: string
) => {
  const data = CadastroMedidaControleColetivaExistente.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: coletivaexistente,
    },
  });

  return data;
};

export const coletivaExistentePutService = (
  empresaId: string,
  descricao: string,
  coletivaexistenteId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroMedidaControleColetivaExistente.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: coletivaexistenteId,
      },
    }
  );

  return data;
};
