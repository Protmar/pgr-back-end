import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  fonteGeradoraDeleteService,
  fonteGeradoraGetAllService,
  fonteGeradoraGetService,
  fonteGeradoraPostService,
  fonteGeradoraPutService,
} from "../../services/cadastros/fontegeradora";

export const dadosCadastroFonteGeradora = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await fonteGeradoraPostService(
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
      const data = await fonteGeradoraGetAllService(empresaId.toString());
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
      const { idfontegeradora } = req.params;
      const data = await fonteGeradoraGetService(
        empresaId.toString(),
        idfontegeradora
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
      const { idfontegeradora } = req.params;
      const { descricao } = req.body;
      const data = await fonteGeradoraPutService(
        empresaId.toString(),
        descricao,
        idfontegeradora
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
      const { idfontegeradora } = req.params;
      const data = await fonteGeradoraDeleteService(
        empresaId.toString(),
        idfontegeradora
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
