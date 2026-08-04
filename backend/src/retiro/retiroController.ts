import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { AdopcionRepositoryORM } from '../adopcion/adopcion.repositoryORM.js';
import { CloudinaryService } from '../shared/cloudinary.service.js';
import { RegistrarRetiroDTO, RegistrarRetiroMaltratoAiven } from './CURegistrarRetiroMaltratoAiven.js';
import { RegistrarRetiroMaltratoMulter } from './CURegistrarRetiroMulter.js';

export const registrarRetiroAiven = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const adopcionRepo = new AdopcionRepositoryORM(em);
        const cloudinaryService = new CloudinaryService();

        const casoUso = new RegistrarRetiroMaltratoAiven(
            adopcionRepo, cloudinaryService, em
        );

        // Armamos el DTO combinando req.body y req.files
        const dto: RegistrarRetiroDTO = {
            nro_adopcion: parseInt(String(req.params.nro_adopcion), 10), // Lo sacamos de la URL
            motivos: req.body.motivos,                           // Viene del FormData (texto)
            descripcion_evidencia: req.body.descripcion_evidencia,
            fecha_retiro: new Date(req.body.fecha_retiro),
            // Multer guarda los archivos en req.files cuando usamos .array()
            archivos: (req.files as Express.Multer.File[]) || [] 
        };

        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casoUso.ejecutar(dto);
        console.log('Resultado del caso de uso registrarRetiro:', resultado);
        res.status(resultado.status).json({ 
            success: resultado.success, 
            messages: resultado.messages, 
            data: resultado.data 
        });
        return;

    } catch (error: unknown) {
        console.error('Error crítico en controlador registrarRetiro:', error);
        res.status(500).json({ 
            success: false, 
            messages: ["Error interno del servidor al procesar el retiro."] 
        });
        return;
    }
};

export const registrarRetiroMulter = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const adopcionRepo = new AdopcionRepositoryORM(em);
        
        const casoUso = new RegistrarRetiroMaltratoMulter(adopcionRepo, em);

        // Armamos el DTO
        const dto: RegistrarRetiroDTO = {
            nro_adopcion: parseInt(req.body.nro_adopcion, 10), 
            motivos: req.body.motivos,                           
            descripcion_evidencia: req.body.descripcion_evidencia,
            fecha_retiro: new Date(req.body.fecha_retiro),
            archivos: (req.files as Express.Multer.File[]) || [] 
        };

        console.log('DTO recibido en el controlador Multer:', dto);
        const resultado = await casoUso.ejecutar(dto);
        console.log('Resultado del caso de uso registrarRetiroMulter:', resultado);
        
        res.status(resultado.status).json({ 
            success: resultado.success, 
            messages: resultado.messages, 
            data: resultado.data 
        });
        return;

    } catch (error: unknown) {
        console.error('Error crítico en controlador registrarRetiro:', error);
        res.status(500).json({ 
            success: false, 
            messages: ["Error interno del servidor al procesar el retiro."] 
        });
        return;
    }
};