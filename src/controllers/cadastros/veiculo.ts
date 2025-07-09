import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { veiculoDeleteService, veiculoGetAllService, veiculoGetService, veiculoPostService, veiculoPutService } from "../../services/cadastros/veiculo";

export const dadosCadastroVeiculo = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await veiculoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
    getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const data = await veiculoGetAllService(empresaId.toString());
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    get: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idveiculo } = req.params;
            const data = await veiculoGetService(empresaId.toString(), idveiculo);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    put: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idveiculo } = req.params;
            const { descricao } = req.body;
            const data = await veiculoPutService(empresaId.toString(), descricao, idveiculo);
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idveiculo } = req.params;
            const data = await veiculoDeleteService(empresaId.toString(), idveiculo);
            res.status(204).json(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
}