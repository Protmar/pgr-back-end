import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { matrizDelete, matrizGet, matrizGetAll, matrizPostService, matrizPut } from "../../services/cadastros/matrizes/matriz";

export const dadosMatriz = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
              const cliente_id = globalThis.cliente_id;
            const {
                tipo,
                parametro,
                size,
            } = req.body;
            const data = await matrizPostService({
                cliente_id: Number(cliente_id),
                tipo,
                parametro,
                size,
            });
            
            
            
            
            res.send(data);
        } catch (err) {
          if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
          }
        }
      },

      getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
          const cliente_id = globalThis.cliente_id as string;
          const data = await matrizGetAll(cliente_id);
          res.send(data);
        } catch (err) {
          if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
          }
        }
      },
    
      get: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
          const cliente_id = globalThis.cliente_id as string;
          const { matrizId } = req.params;
          const data = await matrizGet(cliente_id, matrizId);
          res.send(data);
        } catch (err) {
          if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
          }
        }
      },
      put: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
          const cliente_id = globalThis.cliente_id as string;
          const { matrizId } = req.params;
          const { tipo, parametro, size } = req.body;
          const data = await matrizPut(cliente_id, matrizId, tipo, parametro, size);
          res.send(data);
        } catch (err) {
          if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
          }
        }
      },
    
      delete: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
          const cliente_id = globalThis.cliente_id as string;
          const { matrizId } = req.params;
          const data = await matrizDelete(cliente_id, matrizId);
          return res.status(201).json(data);
        } catch (err) {
          if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
          }
        }
      },
}