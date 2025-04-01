import axios from "axios";
import sharp from "sharp";
import sizeOf from "image-size";
import { getFileToS3 } from "../services/aws/s3";


export const getImageData = async (url: string, maxWidth?: number, maxHeight?: number) => {
    try {

        // const url = await getFileToS3(key);
        
        const result = await axios.get(url, { responseType: "arraybuffer" });
        let imgBuffer = Buffer.from(result.data);

        // Detect the actual image format using Sharp
        const metadata = await sharp(imgBuffer).metadata();
        let img = sharp(imgBuffer);

        // Convert to PNG if the format is not supported by pdfmake (e.g., WebP)
        if (metadata.format === "webp" || metadata.format === "jpeg" || metadata.format === "png") {
            img = img.png(); // Convert to PNG for compatibility
        } else {
            console.warn(`Unsupported image format: ${metadata.format}`);
            return null;
        }

        // Rotate if necessary (based on EXIF orientation)
        img = img.rotate();

        // Resize if exceeds maxWidth or maxHeight
        if (maxWidth || maxHeight) {
            img = img.resize({
                width: maxWidth,
                height: maxHeight,
                fit: "inside", // Ensure the image fits within the bounds without cropping
                withoutEnlargement: true, // Prevent upscaling
            });
        }

        // Convert to buffer and get dimensions
        const processedBuffer = await img.toBuffer();
        const dimensions = sizeOf(processedBuffer);

        return {
            data: `data:image/png;base64,${processedBuffer.toString("base64")}`,
            width: dimensions.width,
            height: dimensions.height,
        };
    } catch (error) {
        console.error("Error processing image:", error);
        return null;
    }
};