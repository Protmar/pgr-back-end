import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AtImagesUrls } from '../../../models/subdivisoesAmbienteTrabalho/AtImagesUrls';
dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

// Função para fazer upload de um arquivo para o S3
export const uploadFileToS3 = async (id_AT: number, filePath: string, fileName: string, mimeType: string) => {
    const fileStream = fs.createReadStream(filePath);
    const key = `uploads/${fileName}`; 

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME, 
        Key: key,
        Body: fileStream,
        ContentType: mimeType,
    });

    try {
        await s3.send(command);
        console.log("Arquivo enviado para o S3 com sucesso.");

        const url = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        }));
        
        // Criação do registro no banco de dados (exemplo comentado)
        // await AtImagesUrls.create({
        //     id_at: id_AT,
        //     url: url,
        //     name: fileName,
        // });

        return url;

    } catch (error) {
        console.error("Erro ao enviar o arquivo para o S3:", error);
        throw new Error("Erro ao enviar o arquivo para o S3");
    }
};

// Função para obter um arquivo do S3 e retornar o URL
export const getFileToS3 = async (fileName: string, empresaId: number) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: "uploads/" + fileName,
    });

    try {
        const url = await getSignedUrl(s3, command);
        return url;

    } catch (error) {
        console.error("Erro ao pegar o arquivo para o S3:", error);
        throw new Error("Erro ao pegar o arquivo para o S3");
    }
};

// Nova função para alterar o conteúdo de um arquivo já existente no S3
export const updateFileInS3 = async (fileName: string, newContent: string) => {
    const fileKey = `uploads/${fileName}`;

    try {
        // 📥 Baixar o arquivo atual
        const getCommand = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        });

        const { Body } = await s3.send(getCommand);
        const currentContent = await streamToString(Body);
        console.log("Conteúdo atual:", currentContent);

        // 📝 Modificar o conteúdo
        const updatedContent = currentContent + "\n" + newContent;

        // 📤 Subir o conteúdo modificado
        const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: updatedContent,
            ContentType: "text/plain",  // Defina o ContentType conforme necessário
        });

        await s3.send(putCommand);
        console.log("Arquivo atualizado no S3 com sucesso!");

        // Retornar o URL assinado do arquivo atualizado
        const url = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        }));

        return url;

    } catch (error) {
        console.error("Erro ao atualizar o arquivo no S3:", error);
        throw new Error("Erro ao atualizar o arquivo no S3");
    }
};

// Função auxiliar para converter stream em string
async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf-8");
}

export default uploadFileToS3;
