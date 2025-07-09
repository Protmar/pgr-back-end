import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { estrategiaAmostragemDeleteService, estrategiaAmostragemGetAllService, estrategiaAmostragemGetService, estrategiaAmostragemPostService, estrategiaAmostragemPutService } from "../../services/cadastros/estrategiaamostragem";

export const dadosCadastroEstrategiaAmostragem = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await estrategiaAmostragemPostService(empresaId.toString(), descricao);

      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const data = await estrategiaAmostragemGetAllService(empresaId.toString());
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idestrategiaamostragem } = req.params;
      const data = await estrategiaAmostragemGetService(empresaId.toString(), idestrategiaamostragem);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idestrategiaamostragem } = req.params;
      const { descricao } = req.body;
      const data = await estrategiaAmostragemPutService(
        empresaId.toString(),
        descricao,
        idestrategiaamostragem
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idestrategiaamostragem } = req.params;
      const data = await estrategiaAmostragemDeleteService(
        empresaId.toString(),
        idestrategiaamostragem
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
