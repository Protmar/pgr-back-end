import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AtImagesUrls } from '../../../models/subdivisoesAmbienteTrabalho/AtImagesUrls';
const sizeOf = require("image-size");
const Sharp = require("sharp");

dotenv.config();

import { Ges } from '../../../models';
import { Sequelize } from 'sequelize';
import { S3 } from 'aws-sdk';

const s3 = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

// Função para fazer upload de um arquivo para o S3
import { Buffer } from 'buffer';
import axios from 'axios';
import sharp from 'sharp';

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

        // Convertendo a URL para base64
        const base64Url = Buffer.from(url).toString('base64');
        return base64Url;

    } catch (error) {
        console.error("Erro ao enviar o arquivo para o S3:", error);
        throw new Error("Erro ao enviar o arquivo para o S3");
    }
};


// Função para obter um arquivo do S3 e retornar o URL
export const getFileToS3 = async (fileName: string, empresaId?: number) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME não está definido");
    }

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: `uploads/${fileName}`,
    });

    try {
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        // Extraindo apenas a URL base do S3
        const baseUrl = url.split("?")[0];

        return {
            fileName,
            url: baseUrl,
        };
    } catch (error) {
        console.error("Erro ao obter URL assinada do S3:", error);
        throw new Error("Erro ao obter URL assinada do S3");
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

export const deleteFileToS3 = async (fileName: string) => {
    const fileKey = `uploads/${fileName}`;

    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        });

        const data = await AtImagesUrls.destroy({
            where: {
                name: fileName
            }
        })

        await s3.send(deleteCommand);
        console.log("Arquivo deletado com sucesso!");

    } catch (error) {
        console.error("Erro ao deletar o arquivo no S3:", error);
        throw new Error("Erro ao deletar o arquivo no S3");
    };


};

export const copyFileInS3WithUniqueName = async (fileName: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME não está definido");
    }

    // 1️⃣ Ajusta o caminho correto do arquivo original
    const sourceKey = `uploads/${fileName}`;

    // 2️⃣ Verifica se o arquivo existe no S3 antes de copiar
    try {
        await s3.send(new HeadObjectCommand({
            Bucket: bucketName,
            Key: sourceKey
        }));
    } catch (error) {
        console.error(`Arquivo ${sourceKey} não encontrado no S3.`);
        throw new Error("Arquivo não existe no S3.");
    }

    // 3️⃣ Criar novo nome com um timestamp, mantendo a extensão original
    const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : ''; // Pega a extensão se existir
    const newFileName = fileExtension
        ? `${fileName}-${Date.now()}.${fileExtension}`
        : `${fileName}-${Date.now()}`;

    const newKey = `uploads/${Date.now().toString()}`;

    // 4️⃣ Copiar o arquivo para o novo nome
    const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${sourceKey}`, // ✅ Agora corretamente montado!
        Key: newKey, // Novo caminho com nome único
    });

    try {
        await s3.send(copyCommand);
        console.log(`Arquivo copiado de ${sourceKey} para ${newKey} com sucesso!`);
        return newKey;
    } catch (error) {
        console.error("Erro ao copiar o arquivo no S3:", error);
        throw new Error("Erro ao copiar o arquivo no S3.");
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
