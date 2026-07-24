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
        
        const casoUso = new RegistrarRescate(repoRes, repoAni, repoPer);
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