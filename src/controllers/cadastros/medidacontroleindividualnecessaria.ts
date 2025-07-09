import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  individualNecessariaDeleteService,
  individualNecessariaGetAllService,
  individualNecessariaGetService,
  individualNecessariaPostService,
  individualNecessariaPutService,
} from "../../services/cadastros/medidascontrole/individualnecessario";

export const dadosCadastroIndividualNecessaria = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await individualNecessariaPostService(
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
      const data = await individualNecessariaGetAllService(
        empresaId.toString()
      );
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
      const { idindividualnecessaria } = req.params;
      const data = await individualNecessariaGetService(
        empresaId.toString(),
        idindividualnecessaria
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
      const { idindividualnecessaria } = req.params;
      const { descricao } = req.body;
      const data = await individualNecessariaPutService(
        empresaId.toString(),
        descricao,
        idindividualnecessaria
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
      const { idindividualnecessaria } = req.params;
      const data = await individualNecessariaDeleteService(
        empresaId.toString(),
        idindividualnecessaria
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
