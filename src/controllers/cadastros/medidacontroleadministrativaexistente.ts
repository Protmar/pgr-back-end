import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  administrativaExistenteDeleteService,
  administrativaExistenteGetAllService,
  administrativaExistenteGetService,
  administrativaExistentePostService,
  administrativaExistentePutService,
} from "../../services/cadastros/medidascontrole/administrativaexistente";

export const dadosCadastroAdministrativaExistente = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await administrativaExistentePostService(
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
      const data = await administrativaExistenteGetAllService(
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
      const { idadministrativaexistente } = req.params;
      const data = await administrativaExistenteGetService(
        empresaId.toString(),
        idadministrativaexistente
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
      const { idadministrativaexistente } = req.params;
      const { descricao } = req.body;
      const data = await administrativaExistentePutService(
        empresaId.toString(),
        descricao,
        idadministrativaexistente
      );
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idadministrativaexistente } = req.params;
      const data = await administrativaExistenteDeleteService(
        empresaId.toString(),
        idadministrativaexistente
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
