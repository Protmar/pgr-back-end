import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  funcaoDeleteService,
  funcaoGetAllService,
  funcaoGetService,
  funcaoPostService,
  funcaoPutService,
} from "../../services/cadastros/funcao";

export const dadosCadastroFuncao = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await funcaoPostService(empresaId.toString(), descricao);
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
      const data = await funcaoGetAllService(empresaId.toString());
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
      const { idfuncao } = req.params;
      const data = await funcaoGetService(empresaId.toString(), idfuncao);
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
      const { idfuncao } = req.params;
      const { descricao, cbo, funcao } = req.body;

      const data = await funcaoPutService(
        empresaId.toString(),
        descricao,
        cbo,
        funcao,
        idfuncao
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
      const { idfuncao } = req.params;
      const data = await funcaoDeleteService(empresaId.toString(), idfuncao);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
