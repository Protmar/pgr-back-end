import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  cargoDeleteService,
  cargoGetAllService,
  cargoGetService,
  cargoPostService,
  cargoPutService,
} from "../../services/cadastros/cargo";
import {
  gerenciaDeleteService,
  gerenciaGetAllService,
  gerenciaGetService,
  gerenciaPostService,
  gerenciaPutService,
} from "../../services/cadastros/gerencia";

export const dadosCadastroCargo = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await cargoPostService(empresaId.toString(), descricao);

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
      const data = await cargoGetAllService(empresaId.toString());
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
      const { idcargo } = req.params;
      const data = await cargoGetService(empresaId.toString(), idcargo);
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
      const { idcargo } = req.params;
      const { descricao } = req.body;
      const data = await cargoPutService(
        empresaId.toString(),
        descricao,
        idcargo
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
      const { idcargo } = req.params;
      const data = await cargoDeleteService(empresaId.toString(), idcargo);
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
