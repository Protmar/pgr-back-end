import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  coletivaNecessariaDeleteService,
  coletivaNecessariaGetAllService,
  coletivaNecessariaGetService,
  coletivaNecessariaPostService,
  coletivaNecessariaPutService,
} from "../../services/cadastros/medidascontrole/coletivanecessario";

export const dadosCadastroColetivaNecessaria = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await coletivaNecessariaPostService(
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
      const data = await coletivaNecessariaGetAllService(empresaId.toString());
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
      const { idcoletivanecessasria } = req.params;
      const data = await coletivaNecessariaGetService(
        empresaId.toString(),
        idcoletivanecessasria
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
      const { idcoletivanecessasria } = req.params;
      const { descricao } = req.body;
      const data = await coletivaNecessariaPutService(
        empresaId.toString(),
        descricao,
        idcoletivanecessasria
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
      const { idcoletivanecessasria } = req.params;
      const data = await coletivaNecessariaDeleteService(
        empresaId.toString(),
        idcoletivanecessasria
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
