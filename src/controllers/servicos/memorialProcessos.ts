
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { deleteMemorialProcessos, getAllMemorialProcessos, getOneMemorialProcessos, postMemorialProcessos, putMemorialProcessos } from "../../services/servicos/memorialProcessos";

export const memorialProcessos = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { cliente_id, servico_id, url_imagem, descricao, tipo_laudo } = req.body;
            const { empresaId } = req.user!;

            console.log( {
                empresa_id: empresaId,
                cliente_id,
                servico_id,
                url_imagem,
                descricao,
                tipo_laudo
            })

            const newMemorialProcesso = await postMemorialProcessos({
                empresa_id: empresaId,
                cliente_id,
                servico_id,
                url_imagem,
                descricao,
                tipo_laudo
            });

            res.status(201).json(newMemorialProcesso);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    },

    put: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const idMemorialProcesso = req.params.memorialprocessoid;
            const { cliente_id, servico_id, url_imagem, descricao, tipo_laudo } = req.body;
            const { empresaId } = req.user!;

            const newMemorialProcesso = await putMemorialProcessos(Number(idMemorialProcesso), {
                empresa_id: empresaId,
                cliente_id,
                servico_id,
                url_imagem,
                descricao,
                tipo_laudo
            });

            res.status(201).json(newMemorialProcesso);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { servicoid } = req.params;

            const servicos = await getAllMemorialProcessos(empresaId, Number(servicoid));

            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getOne: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { servicoid } = req.params;

            const servicos = await getOneMemorialProcessos(empresaId, Number(servicoid));

            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;
        const { memorialprocessoid } = req.params;

        const data = await deleteMemorialProcessos(empresaId, memorialprocessoid);
        res.status(204).json(data);
    },

};


