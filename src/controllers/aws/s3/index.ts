import { Request, Response } from "express";
import { getFileToS3, uploadFileToS3 } from "../../../services/aws/s3";
import { AuthenticatedUserRequest } from "../../../middleware";

export const s3Controller = {
    post: async (req: AuthenticatedUserRequest, res: Response) =>  {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado" });
        }

        const fileUrl = await uploadFileToS3(0, req.file.path, req.file.filename, req.file.mimetype);

        res.json({ message: "Upload bem-sucedido", fileUrl });
    },

    getOne: async (req: AuthenticatedUserRequest, res: Response) =>  {
        const empresaId = req.user!.empresaId;
        const { key } = req.params;

        const url = await getFileToS3(key, empresaId);

        res.json({ url });
    }
    // getOne: async (req: AuthenticatedUserRequest, res: Response) =>  {
    //     const { filename } = req.params;

    //     const 
    // }
};
