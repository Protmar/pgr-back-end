import { Request, Response } from "express";
import { copyFileInS3WithUniqueName, deleteFileToS3, getFileToS3, uploadFileToS3 } from "../../../services/aws/s3";
import { AuthenticatedUserRequest } from "../../../middleware";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream"; // Importa o tipo Readable do Node.js
import { get } from "http";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export const s3Controller = {
    post: async (req: AuthenticatedUserRequest, res: Response) => {
        const file = req.files && req.files['file'] ? req.files['file'] : null;
        if (!file || !file[0]) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        const fileData = {
            path: file[0].path,
            filename: file[0].filename,
            mimetype: file[0].mimetype,
        };

        console.log("Caminho do arquivo:", fileData.path);

        try {
            const fileUrl = await uploadFileToS3(0, fileData.path, fileData.filename, fileData.mimetype);
            res.json({ message: "Upload bem-sucedido", fileUrl, name: fileData.filename });
        } catch (error) {
            console.error("Erro no upload:", error);
            res.status(500).json({ message: "Erro ao fazer upload do arquivo" });
        }
    },

    getOne: async (req: AuthenticatedUserRequest, res: Response) => {
        const empresaId = req.user!.empresaId; // Mantido para consistência
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({ message: "Chave do arquivo não fornecida" });
        }

        try {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `uploads/${key}`,
            });

            const { Body, ContentType } = await s3.send(command);

            if (!Body) {
                return res.status(404).json({ message: "Arquivo não encontrado no S3" });
            }

            // Configura os cabeçalhos da resposta
            res.set('Content-Type', ContentType || 'application/octet-stream');
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET');
            res.set('Access-Control-Allow-Headers', '*');

            // Verifica se Body é um ReadableStream e usa pipe
            if (Body instanceof Readable) {
                Body.pipe(res);
            } else {
                // Caso Body não seja um stream, converte para buffer e envia
                const buffer = await streamToBuffer(Body);
                res.send(buffer);
            }
        } catch (error) {
            console.error("Erro ao buscar arquivo do S3:", error);
            res.status(500).json({ message: "Erro ao buscar arquivo" });
        }
    },

    getOneAWS: async (req: AuthenticatedUserRequest, res: Response) => {
        const empresaId = req.user!.empresaId; // Mantido para consistência
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({ message: "Chave do arquivo não fornecida" });
        }

        try {
            const data = await getFileToS3(key, empresaId)

            res.json(data);
            
        } catch (error) {
            console.error("Erro ao buscar arquivo do S3:", error);
            res.status(500).json({ message: "Erro ao buscar arquivo" });
        }
    },

    deleteOne: async (req: AuthenticatedUserRequest, res: Response) => {
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({ message: "Chave do arquivo não fornecida" });
        }

        try {
            await deleteFileToS3(key);
            res.json({ message: "Arquivo deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            res.status(500).json({ message: "Erro ao deletar arquivo" });
        }
    },

    duplicateFile: async (req: AuthenticatedUserRequest, res: Response) => {
        const key = req.params.key;

        const oldFile = await copyFileInS3WithUniqueName(key);
        res.send(oldFile)
    }
};

// Função auxiliar para converter Body em buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
        if (stream instanceof Readable) {
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        } else if (stream instanceof Blob) {
            stream.arrayBuffer().then((buffer) => resolve(Buffer.from(buffer))).catch(reject);
        } else {
            reject(new Error("Tipo de stream não suportado"));
        }
    });
}