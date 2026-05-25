import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export class CloudinaryService {
    async uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: folder, resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) return resolve(result.secure_url);
                }
            );
            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    };

    async deleteImageByUrl(url: string): Promise<boolean> {
        try {
            // Extraemos el public_id de la URL. 
            // Ejemplo URL: https://res.../v1234/SARA_Audiovisuales/xyz123.jpg
            // Necesitamos extraer: SARA_Audiovisuales/xyz123
            const partes = url.split('/');
            const archivoConExtension = partes.pop(); // "xyz123.jpg"
            const carpeta = partes.pop(); // "SARA_Audiovisuales"
            
            if (!archivoConExtension || !carpeta) return false;

            const publicId = `${carpeta}/${archivoConExtension.split('.')[0]}`;

            // Mandamos la orden de destrucción a Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error("Error al borrar en Cloudinary:", error);
            return false;
        }
    }
}