import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  CursoObrigatorioDeleteService,
  CursoObrigatorioGetAllService,
  CursoObrigatorioGetService,
  CursoObrigatorioPostService,
  CursoObrigatorioPutService,
} from "../../services/cadastros/cursoobrigatorio";

export const dadosCadastroCursoObrigatorio = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await CursoObrigatorioPostService(
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
      const data = await CursoObrigatorioGetAllService(empresaId.toString());
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
      const { idcursoobrigatorio } = req.params;
      const data = await CursoObrigatorioGetService(
        empresaId.toString(),
        idcursoobrigatorio
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
      const { idcursoobrigatorio } = req.params;
      const { descricao } = req.body;
      const data = await CursoObrigatorioPutService(
        empresaId.toString(),
        descricao,
        idcursoobrigatorio
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
      const { idCursoObrigatorio } = req.params;
      const data = await CursoObrigatorioDeleteService(
        empresaId.toString(),
        idCursoObrigatorio
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
