
import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { deleteDadosEstatisticos, getAllDadosEstatisticos, postDadosEstatisticos } from "../../services/servicos/dadosEstatisticos";

export const dadosEstatisticos = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { cliente_id, servico_id, url_imagem, descricao, tipo_laudo } = req.body;
            const { empresaId } = req.user!;

            const newDadoEstatistico = await postDadosEstatisticos({
                empresa_id: empresaId,
                cliente_id,
                servico_id,
                url_imagem,
                descricao,
                tipo_laudo
            });

            res.status(201).json(newDadoEstatistico);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    },

    getAll: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { servicoid } = req.params;
    
            const servicos = await getAllDadosEstatisticos(empresaId, Number(servicoid));
    
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response) => {
        const { empresaId } = req.user!;
        const { dadoestatisticoid } = req.params;

        const data = await deleteDadosEstatisticos(empresaId, dadoestatisticoid);
        res.status(204).json(data);
    },

};


