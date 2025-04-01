import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { severidadeConsequenciaPostService } from "../../services/cadastros/matrizpadrao/severidadeconsequencia";

export const dadosSeveridadeConsequencia = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { matrizId } = req.params;
      const { position, description, criterio } = req.body;
      const data = await severidadeConsequenciaPostService({
        matriz_id: Number(matrizId),
        position: Number(position),
        description,
        criterio,
      });
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
