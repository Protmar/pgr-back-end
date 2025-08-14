
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { deleteArt, getAllArt, getOneArt, postArt, putArt } from "../../services/servicos/art";

export const art = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { cliente_id, servico_id, url_imagem, descricao } = req.body;
            const { empresaId } = req.user!;

            const newArt = await postArt({
                empresa_id: empresaId,
                cliente_id,
                servico_id,
                url_imagem,
                descricao
            });

            res.status(201).json(newArt);
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
            const idArt = req.params.artid;
            const { cliente_id, servico_id, url_imagem, descricao } = req.body;
            const { empresaId } = req.user!;

            const newArt = await putArt(Number(idArt), {
                empresa_id: empresaId,
                cliente_id,
                servico_id,
                url_imagem,
                descricao,
            });

            res.status(201).json(newArt);

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

            const servicos = await getAllArt(empresaId, Number(servicoid));

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

            const servicos = await getOneArt(empresaId, Number(servicoid));

            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },
    

    delete: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;
        const { artid } = req.params;

        const data = await deleteArt(empresaId, artid);
        res.status(204).json(data);
    },

};


