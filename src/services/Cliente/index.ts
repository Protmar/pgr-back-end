import { Cliente } from "../../models/Cliente";
import { ClienteAttributes } from "../../models/Cliente"; // Certifique-se de importar a interface correta

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
): Promise<any> => {
    try {
        // Validação dos campos obrigatórios
        if (!empresa_id || !nome_fantasia || !razao_social) {
            throw new Error("Campos obrigatórios não fornecidos: empresa_id, nome_fantasia, razao_social");
        }

        // Criação do novo cliente no banco de dados
        await Cliente.create({
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
            add_documento_base_url
        });

    } catch (error) {
        console.error("Erro ao criar cliente:", error);
        throw new Error("Erro ao criar o cliente"); // Lança o erro para ser tratado em um nível superior
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
        const cliente = await Cliente.findOne({
            where: {
                id: cliente_id,
                empresa_id
            }
        });

        if (!cliente) {
            throw new Error("Cliente não encontrado");
        }

        await Cliente.destroy({
            where: {
                id: cliente_id,
                empresa_id
            }
        });
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        throw new Error("Erro ao deletar o cliente");
    }
};