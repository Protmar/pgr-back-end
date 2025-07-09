import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  mobiliariosDeleteService,
  mobiliariosGetAllService,
  mobiliariosGetService,
  mobiliariosPostService,
  mobiliariosPutService,
} from "../../services/cadastros/mobiliarios";

export const dadosCadastroMobiliarios = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await mobiliariosPostService(
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
      const data = await mobiliariosGetAllService(empresaId.toString());
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
      const { idmobiliariosbrigatorio } = req.params;
      const data = await mobiliariosGetService(
        empresaId.toString(),
        idmobiliariosbrigatorio
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
      const { idmobiliariosbrigatorio } = req.params;
      const { descricao } = req.body;
      const data = await mobiliariosPutService(
        empresaId.toString(),
        descricao,
        idmobiliariosbrigatorio
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
      const { idmobiliariosbrigatorio } = req.params;
      const data = await mobiliariosDeleteService(
        empresaId.toString(),
        idmobiliariosbrigatorio
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
