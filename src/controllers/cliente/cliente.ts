import { Request, Response } from "express";
import { deleteDadosClienteService, getDadosAllClientesService, getDadosClienteService, postDadosClienteService, postLogoClienteService, putDadosClienteService } from "../../services/Cliente";
import { AuthenticatedUserRequest } from "../../middleware";
import NodeCache from "node-cache";


const cache = new NodeCache({ stdTTL: 0 });

function setCache(key: string, value: number) {
    cache.set(key, value);
}

// Função para recuperar do cache
function getCache(key: string) {
    return cache.get(key);
}


export const dadosCliente = {
    // Método GET para buscar dados de um cliente
    get: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idcliente } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosClienteService(idcliente, empresaId);

            if (!data) {
                res.status(404).json({
                    message: "Cliente não encontrado",
                });
                return;
            }

            res.status(200).json(data); // Alterado para 200 OK
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    // Método POST para criar um novo cliente
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;


        const {
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


        try {
            // Validação dos campos obrigatórios
            if (!empresaId || !nome_fantasia || !razao_social) {
                res.status(400).json({
                    message: "Campos obrigatórios não fornecidos: empresa_id, nome_fantasia, razao_social",
                });
                return;
            }

            // Chama o serviço para criar o cliente
            const newCliente = await postDadosClienteService(
                empresaId,
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
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;

            const data = await getDadosAllClientesService(empresaId.toString());

            if (!data) {
                res.status(404).json({
                    message: "Nenhum cliente encontrado",
                });
                return;
            }

            res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idcliente } = req.params;
            const { empresaId } = req.user!;

            await deleteDadosClienteService(empresaId.toString(), idcliente);

            res.status(200).json({ message: "Cliente Deletado" });
        } catch (err) {
            return res.status(400).json({ message: err });

        }
    },

    put: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idcliente } = req.params;
            const { empresaId } = req.user!;
            const {
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
            } = req.body;

            const updatedData = await putDadosClienteService(
                idcliente,
                empresaId.toString(),
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
            );

            res.status(200).json({
                message: "Cliente atualizado com sucesso",
                cliente: updatedData,
            });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    selecionarCliente: async (req: Request, res: Response) => {
        try {
            const { cliente_id } = req.body;

            if (!cliente_id) {
                return res.status(400).json({
                    message: "O cliente_id é obrigatório",
                });
            }

            globalThis.cliente_id = cliente_id;

            return res.status(200).json({
                message: "Cliente selecionado com sucesso!",
                cliente_id,
            });
        } catch (err) {
            console.error("Erro ao selecionar cliente:", err);
            return res.status(500).json({
                message: err instanceof Error ? err.message : "Erro desconhecido ao selecionar cliente.",
            });
        }
    },

    uploadLogo: async (req: AuthenticatedUserRequest, res: Response) => {
        const { cliente_id, name } = req.body;

        const response = await postLogoClienteService(cliente_id, name);

        return res.status(200).json({
            message: "Logo do cliente atualizado com sucesso",
            response,
        });
    }

};

export { getCache }