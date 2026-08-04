import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Importamos el módulo de sistema de archivos sincrónico

const createStorage = (folderName: string) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // Armamos la ruta dinámicamente según el parámetro
            const dir = `uploads/${folderName}`;
            
            // Si la carpeta no existe, la creamos
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
};

// Exportamos los middlewares listos para usar en tus rutas
export const uploadEvidencias = multer({ storage: createStorage('evidencias') });
export const uploadRescates = multer({ storage: createStorage('rescates') });