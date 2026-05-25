import { Request, Response } from 'express';
import multer from 'multer';
import { em } from '../shared/mikro-orm.config.js';
import { AnimalRepositoryORM } from '../animal/animal.repositoryORM.js';
import { AudiovisualRepositoryORM } from './aud.repositoryORM.js';
import { CloudinaryService } from '../shared/cloudinary.service.js';
import { CreateAudiovisual } from './CU/cargarImagen.js';
import { DeleteAudiovisual } from './CU/eliminarImagen.js';

// Configuramos multer para que guarde el archivo en memoria RAM
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage: storage }).single('archivo'); // 'archivo' es el nombre del campo en el form-data

export const createAudiovisual = async (req: Request, res: Response): Promise<void> => {
    try {
        const numero_animal = parseInt(req.body.numero_animal);

        const file = req.file; 
        if (isNaN(numero_animal) || !file) {
            res.status(400).json({ success: false, messages: ["Falta el animal o el archivo"], data: undefined });
            return;
        };

        const forkedEm = em.fork();
        const audiovisualRepo = new AudiovisualRepositoryORM(forkedEm);
        const animalRepo = new AnimalRepositoryORM(forkedEm);
        const cloudinaryService = new CloudinaryService();

        const casoDeUso = new CreateAudiovisual(audiovisualRepo, animalRepo, cloudinaryService);
        const dto = req.body
        const response = await casoDeUso.ejecutar(dto, file.buffer);
        
        res.status(response.status).json(response);
        return;
    } catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al cargar la imagen', error.message);
            res.status(500).json({ error: "Error al cargar la imagen" });
            return;
        };
        console.error('Error desconocido al cargar la imagen', error);
        res.status(500).json({ error: "Error desconocido al cargar la imagen" });
        return;
    };
};

export const deleteAudiovisual = async (req: Request, res: Response): Promise<void> => {
    try {
        const numero = parseInt(String(req.params.numero));

        if (isNaN(numero)) {
            res.status(400).json({ success: false, messages: ["El ID del audiovisual debe ser numérico"], data: undefined });
            return;
        }

        const forkedEm = em.fork();
        const audiovisualRepo = new AudiovisualRepositoryORM(forkedEm);
        const cloudinaryService = new CloudinaryService();

        const casoDeUso = new DeleteAudiovisual(audiovisualRepo, cloudinaryService);
        const response = await casoDeUso.ejecutar(numero);
        
        res.status(response.status).json(response);
    } catch (error: any) {
        if (error instanceof Error) {
            console.error('Error al cargar la imagen', error.message);
            res.status(500).json({ error: "Error al cargar la imagen" });
            return;
        };
        console.error('Error desconocido al cargar la imagen', error);
        res.status(500).json({ error: "Error desconocido al cargar la imagen" });
        return;
    }
};