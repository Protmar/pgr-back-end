import { CadastroVeiculo } from "../../../models/Veiculos";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const veiculoPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = await CadastroVeiculo.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const veiculoGetAllService = async (empresaId: string) => {
  const data = await CadastroVeiculo.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const veiculoGetService = async (
  empresaId: string,
  veiculoId: string
) => {
  const data = await CadastroVeiculo.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: veiculoId,
    },
  });

  return data;
};

export const veiculoDeleteService = (empresaId: string, veiculoId: string) => {
  const data = CadastroVeiculo.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: veiculoId,
    },
  });

  return data;
};

export const veiculoPutService = (
  empresaId: string,
  descricao: string,
  veiculoId: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroVeiculo.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: veiculoId,
      },
    }
  );

  return data;
};
