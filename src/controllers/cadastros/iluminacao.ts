import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  iluminacaoDeleteService,
  iluminacaoGetAllService,
  iluminacaoGetService,
  iluminacaoPostService,
  iluminacaoPutService,
} from "../../services/cadastros/iluminacao";
import {
  racDeleteService,
  racGetAllService,
  racGetService,
  racPostService,
  racPutService,
} from "../../services/cadastros/rac";

export const dadosCadastroIluminacao = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { descricao } = req.body;
      const { empresaId } = req.user!;

      const data = await iluminacaoPostService(empresaId.toString(), descricao);

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
      const data = await iluminacaoGetAllService(empresaId.toString());
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
      const { idiluminacao } = req.params;
      const data = await iluminacaoGetService(
        empresaId.toString(),
        idiluminacao
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
      const { idiluminacao } = req.params;
      const { descricao } = req.body;
      const data = await iluminacaoPutService(
        empresaId.toString(),
        descricao,
        idiluminacao
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
      const { idiluminacao } = req.params;
      const data = await iluminacaoDeleteService(
        empresaId.toString(),
        idiluminacao
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
