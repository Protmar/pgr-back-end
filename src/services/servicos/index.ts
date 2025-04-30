import { getCache } from "../../controllers/cliente/cliente";
import Servicos from "../../models/Servicos";

export const getDadosServicosService = async (
  idempresa: number,
  idcliente: number,
  descricao: string,
  responsavel_aprovacao: string,
  id_responsavel_aprovacao: number,
  cargo_responsavel_aprovacao: string,
  data_inicio: any,
  data_fim: any
) => {

  const dadoExistente = await Servicos.findOne({
    where: {
      descricao,
    },
  });

  if (dadoExistente) {
    return { success: false, error: "Serviço com essa descrição já cadastrado." };
  }


  const data = await Servicos.create({
    empresa_id: idempresa,
    cliente_id: idcliente,
    descricao: descricao,
    responsavel_aprovacao: responsavel_aprovacao,
    id_responsavel_aprovacao,
    cargo_responsavel_aprovacao: cargo_responsavel_aprovacao,
    data_inicio: data_inicio,
    data_fim: data_fim,
    art_url: "",
    in_use: false
  });

  return data;
};

export const getDadosServicosByEmpresaCliente = async (
  idempresa: number,
) => {

  const idcliente = globalThis.cliente_id;

  if (idcliente) {
    const data = await Servicos.findAll({
      where: {
        empresa_id: idempresa,
        cliente_id: idcliente,
      },
    });

    return data;
  }
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
  params: any
) => {
  const data = await Servicos.update(
    params,
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

export const getDadosServicosByEmpresaClienteId = async (
  idempresa: number,
  idcliente: number
) => {

  const data = await Servicos.findAll({
    where: {
      cliente_id: idcliente,
    },
  });

  return data;
};
