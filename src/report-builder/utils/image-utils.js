const sharp = require('sharp');

async function convertToPng(base64Data, width = null) {
    try {
        const base64Content = base64Data.split(',')[1];
        const buffer = Buffer.from(base64Content, 'base64');
        let sharpInstance = sharp(buffer).png();
        if (width) {
            sharpInstance = sharpInstance.resize({ width });
        }
        const pngBuffer = await sharpInstance.toBuffer();
        return `data:image/png;base64,${pngBuffer.toString('base64')}`;
    } catch (error) {
        throw new Error(`Erro ao converter imagem para PNG: ${error.message}`);
    }
}

module.exports = { convertToPng };