import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { racDeleteService, racGetAllService, racGetService, racPostService, racPutService } from "../../services/cadastros/rac";

export const dadosCadastroRac = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await racPostService(empresaId.toString(), descricao);
            
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
            const data = await racGetAllService(empresaId.toString());
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
            const { idrac } = req.params;
            const data = await racGetService(empresaId.toString(), idrac);
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
            const { idrac } = req.params;
            const { descricao } = req.body;
            const data = await racPutService(empresaId.toString(), descricao, idrac);
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
            const { idrac } = req.params;
            const data = await racDeleteService(empresaId.toString(), idrac);
            res.status(204).json(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
}