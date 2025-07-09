import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  exposicaoDeleteService,
  exposicaoGetAllService,
  exposicaoGetService,
  exposicaoPostService,
  exposicaoPutService,
} from "../../services/cadastros/exposicao";

export const dadosCadastroExposicao = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await exposicaoPostService(empresaId.toString(), descricao);

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
      const data = await exposicaoGetAllService(empresaId.toString());
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
      const { idexposicao } = req.params;
      const data = await exposicaoGetService(empresaId.toString(), idexposicao);
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
      const { idexposicao } = req.params;
      const { descricao } = req.body;
      const data = await exposicaoPutService(
        empresaId.toString(),
        descricao,
        idexposicao
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
      const { idexposicao } = req.params;
      const data = await exposicaoDeleteService(
        empresaId.toString(),
        idexposicao
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
