import { Request, Response } from "express";
import { copiaGesService } from "../../services/copia";

export const dadosCopias = {
    post: async (req: Request, res: Response) => {
        try {
            const { newServico_id, ges_id, newCliente_id } = req.body;

            const data = copiaGesService({ newCliente_id, newServico_id, ges_id });

            res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    }
}