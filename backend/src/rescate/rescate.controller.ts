import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { RescateRepositoryORM } from "./rescate.repositoryORM.js";
import { PersonaRepositoryORM } from "../persona/persona.repositoryORM.js";
import { AnimalRepositoryORM } from "../animal/animal.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAllRescates } from "./CU/findAllRescates.js";
import { CreateRescate } from "./CU/createRescate.js";
import { GetOneRescates } from "./CU/getOneRescate.js";
import { UpdateRescate } from "./CU/updateRescate.js";

export const findAllRescates = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new RescateRepositoryORM(em);
        const casouso = new FindAllRescates(repo);
    
        const resultado = await casouso.ejecutar();
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar los rescates', error.message);
            res.status(500).json({ error: "Error al buscar los rescates" });
            return;
        };
        console.error('Error desconocido al buscar todos los rescates', error);
        res.status(500).json({ error: "Error desconocido al buscar todos los rescates" });
        return;
    };
};

export const getOneRescate = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repoRes = new RescateRepositoryORM(em);
        const repoAni = new AnimalRepositoryORM(em);
        const repoPer = new PersonaRepositoryORM(em);
        const casouso = new GetOneRescates(repoRes, repoAni, repoPer);
        
        const { valor:codValP, error: codErrorP } = validarCodigo(req.params.numero_p, 'numero de persona');
        if (codErrorP || codValP === undefined) {
            res.status(400).json({ error: codErrorP });
            return;
        };

        const { valor:codValA, error: codErrorA } = validarCodigo(req.params.numero_a, 'numero de animal');
        if (codErrorA || codValA === undefined) {
            res.status(400).json({ error: codErrorA });
            return;
        };

        const fecha = new Date(String(req.params.fecha_hora));
        if (isNaN(fecha.getTime())) {
            res.status(400).json({ error: "Fecha y hora inválida" });
            return;
        }

        const resultado = await casouso.ejecutar(codValP, codValA, fecha);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar el rescate', error.message);
            res.status(500).json({ error: "Error al buscar el rescate" });
            return;
        };
        console.error('Error desconocido al buscar el rescate', error);
        res.status(500).json({ error: "Error desconocido al buscar el rescate" });
        return;
    };
};

export const createRescate = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repoRes = new RescateRepositoryORM(em);
        const repoAni = new AnimalRepositoryORM(em);
        const repoPer = new PersonaRepositoryORM(em);
        const casouso = new CreateRescate(repoRes, repoAni, repoPer);
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el rescate', error.message);
            res.status(500).json({ error: "Error al crear el rescate" });
            return;
        };
        console.error('Error desconocido al crear el rescate', error);
        res.status(500).json({ error: "Error desconocido al crear el rescate" });
        return;
    };
};

export const updateRescate = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repoRes = new RescateRepositoryORM(em);
        const repoAni = new AnimalRepositoryORM(em);
        const repoPer = new PersonaRepositoryORM(em);
        const casouso = new UpdateRescate(repoRes, repoAni, repoPer);
        
        const { valor:codValP, error: codErrorP } = validarCodigo(req.params.numero_p, 'numero de persona');
        if (codErrorP || codValP === undefined) {
            res.status(400).json({ error: codErrorP });
            return;
        };

        const { valor:codValA, error: codErrorA } = validarCodigo(req.params.numero_a, 'numero de animal');
        if (codErrorA || codValA === undefined) {
            res.status(400).json({ error: codErrorA });
            return;
        };

        const fecha = new Date(String(req.params.fecha_hora));
        if (isNaN(fecha.getTime())) {
            res.status(400).json({ error: "Fecha y hora inválida" });
            return;
        }

        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(codValP, codValA, fecha, dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el rescate', error.message);
            res.status(500).json({ error: "Error al crear el rescate" });
            return;
        };
        console.error('Error desconocido al crear el rescate', error);
        res.status(500).json({ error: "Error desconocido al crear el rescate" });
        return;
    }
}