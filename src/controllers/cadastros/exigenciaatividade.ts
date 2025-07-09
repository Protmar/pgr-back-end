import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { exigenciaAtividadeDeleteService, exigenciaAtividadeGetAllService, exigenciaAtividadeGetService, exigenciaAtividadePostService, exigenciaAtividadePutService } from "../../services/cadastros/exigenciaatividade";


export const dadosCadastroExigenciaAtividade = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await exigenciaAtividadePostService(empresaId.toString(), descricao);

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
      const data = await exigenciaAtividadeGetAllService(empresaId.toString());
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
      const { idexigenciaatividade } = req.params;
      const data = await exigenciaAtividadeGetService(empresaId.toString(), idexigenciaatividade);
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
      const { idexigenciaatividade } = req.params;
      const { descricao } = req.body;
      const data = await exigenciaAtividadePutService(empresaId.toString(), descricao, idexigenciaatividade);
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
      const { idexigenciaatividade } = req.params;
      const data = await exigenciaAtividadeDeleteService(empresaId.toString(), idexigenciaatividade);
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
