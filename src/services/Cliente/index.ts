import { Cliente } from "../../models/Cliente";
import { ClienteAttributes } from "../../models/Cliente"; // Certifique-se de importar a interface correta
import Servicos from "../../models/Servicos";
import Trabalhadores from "../../models/Trabalhadores";
import uploadFileToS3 from "../aws/s3";

// Serviço para obter os dados de um cliente pelo ID
export const getDadosClienteService = async (
  id: any,
  empresa_id: any
): Promise<any> => {
  const data = await Cliente.findOne({
    where: {
      id,
      empresa_id,
    },
  });

  return data;
};

// Serviço para criar um novo cliente
// Serviço para criar um novo cliente
export const postDadosClienteService = async (
  empresa_id: number,
  cnpj: string,
  nome_fantasia: string,
  razao_social: string,
  cnae: string,
  atividade_principal: string,
  grau_de_risco: string,
  cep: string,
  estado: string,
  cidade: string,
  localizacao_completa: string,
  email_financeiro: string,
  contato_financeiro: string,
  observacoes: string,
  logo_url: string,
  add_documento_base_url: string
): Promise<{ success: boolean; cliente?: any; error?: string }> => {
  try {
    // Primeiro, verificar se já existe um cliente com o mesmo CNPJ e empresa_id
    const dadoExistente = await Cliente.findOne({
      where: {
        empresa_id,
        nome_fantasia
      },
    });

    if (dadoExistente) {
      return { success: false, error: "Cliente com este nome já cadastrado." };
    }

    // Se não existir, cria um novo cliente
    const cliente = await Cliente.create({
      empresa_id,
      cnpj,
      nome_fantasia,
      razao_social,
      cnae,
      atividade_principal,
      grau_de_risco,
      cep,
      estado,
      cidade,
      localizacao_completa,
      email_financeiro,
      contato_financeiro,
      observacoes,
      logo_url,
      add_documento_base_url,
    });

    return { success: true, cliente };
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    return { success: false, error: error.message || "Erro ao criar cliente." };
  }
};


export const getDadosAllClientesService = async (id: string): Promise<any> => {
  const data = await Cliente.findAll({
    where: {
      empresa_id: id
    }
  });


  return data;
}

export const deleteDadosClienteService = async (
  empresa_id: string,
  cliente_id: string
): Promise<void> => {
  try {
    // Verifica se existem trabalhadores vinculados ao cliente
    const trabalhadoresVinculados = await Trabalhadores.findOne({
      where: { cliente_id },
    });

    if (trabalhadoresVinculados) {
      throw new Error("Não é possível excluir o cliente, pois existem trabalhadores vinculados.");
    }

    // Se não houver trabalhadores, pode excluir o cliente
    const resultado = await Cliente.destroy({
      where: {
        id: cliente_id,
        empresa_id,
      },
    });

    if (resultado === 0) {
      throw new Error("Cliente não encontrado ou já foi excluído.");
    }
  } catch (err: any) {
    console.error("Erro ao excluir cliente:", err);
    throw new Error(err.message || "Erro desconhecido ao excluir cliente.");
  }
};

export const putDadosClienteService = async (
  id: string,
  empresa_id: string,
  cnpj: string,
  nome_fantasia: string,
  razao_social: string,
  cnae: string,
  atividade_principal: string,
  grau_de_risco: string,
  cep: string,
  estado: string,
  cidade: string,
  localizacao_completa: string,
  email_financeiro: string,
  contato_financeiro: string,
  observacoes: string,
  logo_url: string,
  add_documento_base_url: string
): Promise<any> => {
  const data = await Cliente.update(
    {
      cnpj,
      nome_fantasia,
      cnae,
      atividade_principal,
      grau_de_risco,
      localizacao_completa,
      email_financeiro,
      logo_url,
      add_documento_base_url
    },
    {
      where: {
        id,
        empresa_id,
      },
    }
  );

  return data;
};

export const postLogoClienteService = async (
  name: string,
  cliente_id: number
) => {
  const data = await Cliente.update(
    {
      logo_url: name
    },
    {
      where: {
        id: cliente_id
      }
    }
  );

  return data;
}
