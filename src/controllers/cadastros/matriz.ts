import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { matrizPostService } from "../../services/cadastros/matrizes/matriz";

export const dadosMatriz = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { clienteId } = req.params!;
            const {
                tipo,
                parametro,
                size,
            } = req.body;
            const data = await matrizPostService({
                clienteId: clienteId,
                tipo,
                parametro,
                size,
            }); res.send(data);
        } catch (err) {
          if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
          }
        }
      },
}