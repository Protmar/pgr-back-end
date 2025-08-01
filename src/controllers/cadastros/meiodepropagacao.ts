import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  meioDePropagacaoDeleteService,
  meioDePropagacaoGetAllService,
  meioDePropagacaoGetService,
  meioDePropagacaoPostService,
  meioDePropagacaoPutService,
} from "../../services/cadastros/meiodepropagacao";

export const dadosCadastroMeioDePropagacao = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await meioDePropagacaoPostService(
        empresaId.toString(),
        descricao
      );

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
      const data = await meioDePropagacaoGetAllService(empresaId.toString());
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
      const { idmeiodepropagacao } = req.params;
      const data = await meioDePropagacaoGetService(
        empresaId.toString(),
        idmeiodepropagacao
      );
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
      const { idmeiodepropagacao } = req.params;
      const { descricao } = req.body;
      const data = await meioDePropagacaoPutService(
        empresaId.toString(),
        descricao,
        idmeiodepropagacao
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
      const { idmeiodepropagacao } = req.params;
      const data = await meioDePropagacaoDeleteService(
        empresaId.toString(),
        idmeiodepropagacao
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
