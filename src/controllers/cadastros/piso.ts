import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { pisoDeleteService, pisoGetAllService, pisoGetService, pisoPostService, pisoPutService } from "../../services/cadastros/piso";

export const dadosCadastroPiso = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await pisoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
    getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const data = await pisoGetAllService(empresaId.toString());
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    get: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idpiso } = req.params;
            const data = await pisoGetService(empresaId.toString(), idpiso);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    put: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idpiso } = req.params;
            const { descricao } = req.body;
            const data = await pisoPutService(empresaId.toString(), descricao, idpiso);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idpiso } = req.params;
            const data = await pisoDeleteService(empresaId.toString(), idpiso);
            res.status(204).json(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
}