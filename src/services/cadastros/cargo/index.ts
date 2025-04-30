import { CadastroGerencia } from "../../../models/Gerencias";
import { CadastroCargo } from "../../../models/Cargos";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const cargoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const dadoExistente = await CadastroCargo.findOne({
      where: {
        descricao: descricaoFormatada,
      },
    });
  
    if (dadoExistente) {
      return { success: false, error: "Cargo com essa descrição já cadastrado." };
    }

  const data = await CadastroCargo.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const cargoGetAllService = async (empresaId: string) => {
  const data = await CadastroCargo.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const cargoGetService = async (empresaId: string, idcargo: string) => {
  const data = await CadastroCargo.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idcargo,
    },
  });

  return data;
};

export const cargoDeleteService = (empresaId: string, idcargo: string) => {
  const data = CadastroCargo.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idcargo,
    },
  });

  return data;
};

export const cargoPutService = (
  empresaId: string,
  descricao: string,
  cargoId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroCargo.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: cargoId,
      },
    }
  );

  return data;
};
