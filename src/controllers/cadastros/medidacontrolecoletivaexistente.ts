import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  coletivaExistenteDeleteService,
  coletivaExistenteGetAllService,
  coletivaExistenteGetService,
  coletivaExistentePostService,
  coletivaExistentePutService,
} from "../../services/cadastros/medidascontrole/coletivaexistente";

export const dadosCadastroColetivaExistente = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await coletivaExistentePostService(
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
      const data = await coletivaExistenteGetAllService(empresaId.toString());
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
      const { idcoletivaexistente } = req.params;
      const data = await coletivaExistenteGetService(
        empresaId.toString(),
        idcoletivaexistente
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
      const { idcoletivaexistente } = req.params;
      const { descricao } = req.body;
      const data = await coletivaExistentePutService(
        empresaId.toString(),
        descricao,
        idcoletivaexistente
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
      const { idcoletivaexistente } = req.params;
      const data = await coletivaExistenteDeleteService(
        empresaId.toString(),
        idcoletivaexistente
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
