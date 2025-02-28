import Servicos from "../../models/Servicos";

export const getDadosServicosService = async (
  idempresa: number,
  idcliente: number,
  descricao: string,
  responsavel_aprovacao: string,
  cargo_responsavel_aprovacao: string,
  data_inicio: any,
  data_fim: any
) => {
  const data = await Servicos.create({
    empresa_id: idempresa,
    cliente_id: idcliente,
    descricao: descricao,
    responsavel_aprovacao: responsavel_aprovacao,
    cargo_responsavel_aprovacao: cargo_responsavel_aprovacao,
    data_inicio: data_inicio,
    data_fim: data_fim,
    art_url: "",
  });

  return data;
};

export const getDadosServicosByEmpresaCliente = async (
  idempresa: number,
  idcliente: number
) => {
  const data = await Servicos.findAll({
    where: {
      empresa_id: idempresa,
      cliente_id: idcliente,
    },
  });

  return data;
};

export const getDadosServicoByEmpresaServico = async (
  idempresa: number,
  idservico: number
) => {
  const data = await Servicos.findOne({
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });

  return data;
};

export const putDadosServicosService = async (
  idempresa: number,
  idservico: number,
  descricao: string,
  responsavel_aprovacao: string,
  cargo_responsavel_aprovacao: string,
  data_inicio: any,
  data_fim: any
) => {
  const data = await Servicos.update(
    {
      descricao: descricao,
      responsavel_aprovacao: responsavel_aprovacao,
      cargo_responsavel_aprovacao: cargo_responsavel_aprovacao,
      data_inicio: data_inicio,
      data_fim: data_fim,
    },
    {
      where: {
        empresa_id: idempresa,
        id: idservico,
      },
    }
  );

  return data;
};

export const deleteDadosServicoByEmpresaServico = async (
  idempresa: number,
  idservico: number
) => {
  const data = await Servicos.destroy({
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });

  return data;
};
