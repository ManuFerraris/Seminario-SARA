import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { RescateRepositoryORM } from "./rescate.repositoryORM.js";
import { PersonaRepositoryORM } from "../persona/persona.repositoryORM.js";
import { AnimalRepositoryORM } from "../animal/animal.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAllRescates } from "./CU/findAllRescates.js";
import { CreateRescate } from "./CU/createRescate.js";
import { UpdateRescate } from "./CU/updateRescate.js";
import { GetOneRescates } from "./CU/getOneRescate.js";
import { DeleteRescate } from "./CU/deleteRescate.js";
import { RegistrarRescate } from "./CU/registrarRescate.js";

export const findAllRescates = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new RescateRepositoryORM(em);
        const casoUso = new FindAllRescates(repo);
    
        const resultado = await casoUso.ejecutar();
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar los rescates:', error.message);
            res.status(500).json({ error: "Error al buscar los rescates" });
            return;
        }
        res.status(500).json({ error: "Error desconocido al buscar todos los rescates" });
        return;
    }
};

export const getOneRescate = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repoRes = new RescateRepositoryORM(em);
        
        // Solo necesitamos el repo de rescates
        const casoUso = new GetOneRescates(repoRes);
        
        // Validamos únicamente la PK subrogada
        const { valor: codValR, error: codErrorR } = validarCodigo(req.params.nro_rescate, 'número de rescate');
        if (codErrorR || codValR === undefined) {
            res.status(400).json({ error: codErrorR });
            return;
        }

        const resultado = await casoUso.ejecutar(codValR);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar el rescate:', error.message);
            res.status(500).json({ error: "Error al buscar el rescate" });
            return;
        }
        res.status(500).json({ error: "Error desconocido al buscar el rescate" });
        return;
    }
};

export const createRescate = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const repoRes = new RescateRepositoryORM(em);
        const repoAni = new AnimalRepositoryORM(em);
        const repoPer = new PersonaRepositoryORM(em);
        
        const casoUso = new CreateRescate(repoRes, repoAni, repoPer);
        const dto = req.body;
        
        const resultado = await casoUso.ejecutar(dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al crear el rescate:', error.message);
            res.status(500).json({ error: "Error al crear el rescate" });
            return;
        }
        res.status(500).json({ error: "Error desconocido al crear el rescate" });
        return;
    }
};

export const updateRescate = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repoRes = new RescateRepositoryORM(em);
        const casoUso = new UpdateRescate(repoRes);
        
        // Extraemos solo el ID del rescate
        const { valor: codValR, error: codErrorR } = validarCodigo(req.params.nro_rescate, 'número de rescate');
        if (codErrorR || codValR === undefined) {
            res.status(400).json({ error: codErrorR });
            return;
        }

        const dto = req.body;
        
        // Le pasamos la PK simple y el DTO
        const resultado = await casoUso.ejecutar(codValR, dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al actualizar el rescate:', error.message);
            res.status(500).json({ error: "Error al actualizar el rescate" });
            return;
        }
        res.status(500).json({ error: "Error desconocido al actualizar el rescate" });
        return;
    }
};

export const deleteRescate = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repoRes = new RescateRepositoryORM(em);
        const casoUso = new DeleteRescate(repoRes);
        
        const { valor: codValR, error: codErrorR } = validarCodigo(req.params.nro_rescate, 'número de rescate');
        if (codErrorR || codValR === undefined) {
            res.status(400).json({ error: codErrorR });
            return;
        }

        const resultado = await casoUso.ejecutar(codValR);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al eliminar el rescate:', error.message);
            res.status(500).json({ error: "Error al eliminar el rescate" });
            return;
        }
        res.status(500).json({ error: "Error desconocido al eliminar el rescate" });
        return;
    }
};

// CU-Registrar Rescate
export const registrarRescate = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const repoRes = new RescateRepositoryORM(em);
        const repoAni = new AnimalRepositoryORM(em);
        const repoPer = new PersonaRepositoryORM(em);
        
        // Inyectamos el 'em' en el caso de uso
        const casoUso = new RegistrarRescate(repoRes, repoAni, repoPer, em);
        
        // Armamos el DTO manualmente convirtiendo los tipos que llegan como string desde el FormData
        const dtoRegistrarRescate = {
            dni_rescatista: req.body.dni_rescatista,
            animal_especie: req.body.animal_especie,
            animal_sexo: req.body.animal_sexo,
            animal_raza: req.body.animal_raza,
            // Convertimos los numéricos usando parseFloat y parseInt
            animal_peso: parseFloat(req.body.animal_peso),
            animal_estado: req.body.animal_estado,
            animal_edad_estimada: parseInt(req.body.animal_edad_estimada, 10),
            animal_descripcion: req.body.animal_descripcion,
            lugar_rescate_descripcion: req.body.lugar_rescate_descripcion,
            fecha_rescate: req.body.fecha_rescate,
            fecha_ingreso_animal: req.body.fecha_ingreso_animal,
            // Atrapamos las fotos de Multer
            archivos: (req.files as Express.Multer.File[]) || []
        };

        console.log('DTO parseado para registrar rescate:', dtoRegistrarRescate);
        const resultado = await casoUso.ejecutar(dtoRegistrarRescate);
        console.log('Resultado del caso de uso registrar rescate:', resultado);

        res.status(resultado.status).json({ 
            success: resultado.success, 
            messages: resultado.messages, 
            data: resultado.data 
        });
        return;

    } catch (error: unknown) {
        console.error('Error crítico en controlador registrarRescate:', error);
        res.status(500).json({ 
            success: false, 
            messages: ["Error desconocido al crear el rescate"] 
        });
        return;
    }
};