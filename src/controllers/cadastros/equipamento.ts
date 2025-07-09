import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  equipamentoDeleteService,
  equipamentoGetAllService,
  equipamentoGetService,
  equipamentoPostService,
  equipamentoPutService,
} from "../../services/cadastros/equipamento";

export const dadosCadastroEquipamento = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await equipamentoPostService(
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
      const data = await equipamentoGetAllService(empresaId.toString());
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
      const { idequipamento } = req.params;
      const data = await equipamentoGetService(
        empresaId.toString(),
        idequipamento
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
      const { idequipamento } = req.params;
      const { descricao } = req.body;
      const data = await equipamentoPutService(
        empresaId.toString(),
        descricao,
        idequipamento
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
      const { idequipamento } = req.params;
      const data = await equipamentoDeleteService(
        empresaId.toString(),
        idequipamento
      );
      res.status(204).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
