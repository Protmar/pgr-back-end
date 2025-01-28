import { Request, Response } from "express";
import { deleteDadosClienteService, getDadosAllClientesService, getDadosClienteService, postDadosClienteService } from "../../services/Cliente";

export const dadosCliente = {
    // Método GET para buscar dados de um cliente
    get: async (req: Request, res: Response): Promise<void> => {
        try {
            const { idcliente, idempresa } = req.params;

            const data = await getDadosClienteService(idcliente, idempresa);

            if (!data) {
                res.status(404).json({
                    message: "Cliente não encontrado",
                });
                return;
            }

            res.status(200).json(data); // Alterado para 200 OK
        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
            res.status(500).json({
                message: "Erro ao buscar dados do cliente",
            });
        }
    },

    // Método POST para criar um novo cliente
    post: async (req: any, res: any): Promise<void> => {
        const {
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
        } = req.body;

        const { idempresa } = req.params;

        try {
            // Validação dos campos obrigatórios
            if (!empresa_id || !nome_fantasia || !razao_social) {
                res.status(400).json({
                    message: "Campos obrigatórios não fornecidos: empresa_id, nome_fantasia, razao_social",
                });
                return;
            }

            // Chama o serviço para criar o cliente
            const newCliente = await postDadosClienteService(
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
                
            );

            // Resposta de sucesso
            res.status(201).json({
                message: "Cliente criado com sucesso",
                cliente: newCliente, // Retorna os dados do cliente criado
            });
        } catch (error) {
            console.error("Erro ao criar o cliente:", error);  // Registra o erro completo no console
            res.status(500).json({
                message: "Erro ao criar o cliente",
                error: error
            });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const { idempresa } = req.params;

            const data = await getDadosAllClientesService(idempresa);

            if(!data) {
                res.status(404).json({
                    message: "Nenhum cliente encontrado",
                });
                return;
            }

            res.status(200).json(data);
        } catch (error) {
            console.error("Erro ao buscar todos os clientes:", error);
            res.status(500).json({
                message: "Erro ao buscar todos os clientes",
                error: error
            });
        }
    },

    delete: async (req: Request, res: Response) => {
        const { idempresa, idcliente } = req.params;

        await deleteDadosClienteService(idempresa, idcliente);

        res.status(200).json({ message: "Cliente Deletado" });
    }
};
