import { Cliente } from "../../models/Cliente";
import { ClienteAttributes } from "../../models/Cliente"; // Certifique-se de importar a interface correta
import Servicos from "../../models/Servicos";

// Serviço para obter os dados de um cliente pelo ID
export const getDadosClienteService = async (id: any, empresa_id: any): Promise<any> => {
    try {
        const data = await Cliente.findOne({
            where: {
                id,
                empresa_id
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw new Error("Erro ao buscar dados do cliente");
    }
}

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
    add_documento_base_url: string,
): Promise<{ success: boolean; cliente?: any; error?: string }> => {
    try {
        // Criação do novo cliente no banco de dados
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

        // Retorna o cliente criado
        return { success: true, cliente };
    } catch (error: any) {
        console.error("Erro ao criar cliente:", error.message);

        // Lança erro para níveis superiores
        return { success: false, error: error.message || "Erro desconhecido" };
    }
};


export const getDadosAllClientesService = async (id: string): Promise<any> => {
    try {
        const data = await Cliente.findAll({
            where: {
                empresa_id: id
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar todos os clientes:", error);
        throw new Error("Erro ao buscar todos os clientes");
    }
}

export const deleteDadosClienteService = async (empresa_id: string, cliente_id: string): Promise<void> => {
    try {

        await Cliente.destroy({
            where: {
                id: cliente_id,
                empresa_id
            }
        });
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        throw new Error("Erro ao deletar cliente");
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
): Promise<any> => {
    try {
        const data = await Cliente.update({
            cnpj,
            nome_fantasia,
            cnae,
            atividade_principal,
            grau_de_risco,
            localizacao_completa,
            email_financeiro,

        }, {
            where: {
                id,
                empresa_id
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
        throw new Error("Erro ao salvar no banco");
    }
}