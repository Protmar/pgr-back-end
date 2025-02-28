import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { tipoPgrDeleteService, tipoPgrGetAllService, tipoPgrGetService, tipoPgrPostService, tipoPgrPutService } from "../../services/cadastros/tipoPgr";

export const dadosCadastroTipoPgr = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await tipoPgrPostService(empresaId.toString(), descricao);
            
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
            const data = await tipoPgrGetAllService(empresaId.toString());
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
            const { idtipopgr } = req.params;
            const data = await tipoPgrGetService(empresaId.toString(), idtipopgr);
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
            const { idtipopgr } = req.params;
            const { descricao } = req.body;
            const data = await tipoPgrPutService(empresaId.toString(), descricao, idtipopgr);
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
            const { idtipopgr } = req.params;
            const data = await tipoPgrDeleteService(empresaId.toString(), idtipopgr);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
}