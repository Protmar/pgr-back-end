import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { ventilacaoDeleteService, ventilacaoGetAllService, ventilacaoGetService, ventilacaoPostService, ventilacaoPutService } from "../../services/cadastros/ventilacao";

export const dadosCadastroVentilacao = {
    post: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await ventilacaoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
    getAll: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const data = await ventilacaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    get: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idventilacao } = req.params;
            const data = await ventilacaoGetService(empresaId.toString(), idventilacao);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    put: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idventilacao } = req.params;
            const { descricao } = req.body;
            const data = await ventilacaoPutService(empresaId.toString(), descricao, idventilacao);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    delete: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idventilacao } = req.params;
            const data = await ventilacaoDeleteService(empresaId.toString(), idventilacao);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
}