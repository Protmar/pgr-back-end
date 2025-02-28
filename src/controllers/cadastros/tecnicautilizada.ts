import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { tecnicaUtilizadaDeleteService, tecnicaUtilizadaGetAllService, tecnicaUtilizadaGetService, tecnicaUtilizadaPostService, tecnicaUtilizadaPutService } from "../../services/cadastros/tecnicautilizada";

export const dadosCadastroTecnicaUtilizada = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await tecnicaUtilizadaPostService(empresaId.toString(), descricao);
            
            res.send(data)
        }catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
    getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const data = await tecnicaUtilizadaGetAllService(empresaId.toString());
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
            const { idtecnicautilizada } = req.params;
            const data = await tecnicaUtilizadaGetService(empresaId.toString(), idtecnicautilizada);
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
            const { idtecnicautilizada } = req.params;
            const { descricao } = req.body;
            const data = await tecnicaUtilizadaPutService(empresaId.toString(), descricao, idtecnicautilizada);
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
            const { idtecnicautilizada } = req.params;
            const data = await tecnicaUtilizadaDeleteService(empresaId.toString(), idtecnicautilizada);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
}