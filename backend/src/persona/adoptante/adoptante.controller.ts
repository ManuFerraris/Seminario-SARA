import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { validarCodigo } from "../../helpers/validarCodigo.js";
import { AdoptanteRepositoryORM } from "./adoptante.repositotyORM.js";
import { PersonaRepositoryORM } from "../persona.repositoryORM.js";
import { FindAllAdoptantes } from "./CU/findAllAdoptante.js";
import { GetOneAdoptantes } from "./CU/getOneAdoptante.js";
import { DeleteAdoptante } from "./CU/deleteAdoptante.js";
import { CreateAdoptante } from "./CU/createAdoptante.js";
import { UpdateAdoptante } from "./CU/updateAdoptante.js";

export const findAll = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AdoptanteRepositoryORM(em);
        const casouso = new FindAllAdoptantes(repo);
        
        const resultado = await casouso.ejecutar();
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar los adoptantes', error.message);
            res.status(500).json({ error: "Error al buscar los adoptantes" });
            return;
        };
        console.error('Error desconocido al buscar todos los adoptantes', error);
        res.status(500).json({ error: "Error desconocido al buscar todos los adoptantes" });
        return;
    };
};

export const findOne = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AdoptanteRepositoryORM(em);
        const casouso = new GetOneAdoptantes(repo);
        
        const {valor:codVal, error:codError} = validarCodigo(req.params.numero_persona, 'numero_persona');
        if(codError || codVal === undefined){
            res.status(400).json({ error: codError });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar el adoptante', error.message);
            res.status(500).json({ error: "Error al buscar el adoptante" });
            return;
        };
        console.error('Error desconocido al buscar el adoptante', error);
        res.status(500).json({ error: "Error desconocido al buscar el adoptante" });
        return;
    };
};

export const create = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const adoptanteRepo = new AdoptanteRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const casouso = new CreateAdoptante(adoptanteRepo, personaRepo);

        const dto = req.body;

        const resultado = await casouso.ejecutar(dto);
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el adoptante', error.message);
            res.status(500).json({ error: "Error al crear el adoptante" });
            return;
        };
        console.error('Error desconocido al crear el adoptante', error);
        res.status(500).json({ error: "Error desconocido al crear el adoptante" });
        return;
    }
};

export const update = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const adoptanteRepo = new AdoptanteRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const casouso = new UpdateAdoptante(adoptanteRepo, personaRepo);

        const {valor:codVal, error:codError} = validarCodigo(req.params.numero_persona, 'numero_persona');
        if(codError || codVal === undefined){
            res.status(400).json({ error: codError });
            return;
        };

        const dto = req.body;

        const resultado = await casouso.ejecutar(codVal, dto);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al actualizar el adoptante', error.message);
            res.status(500).json({ error: "Error al actualizar el adoptante" });
            return;
        };
        console.error('Error desconocido al actualizar el adoptante', error);
        res.status(500).json({ error: "Error desconocido al actualizar el adoptante" });
        return;
    }
};

//Lo creamos para tener la CRUD completa, pero NO LO USAREMOS, en cambio usaremos la Baja Logica.
export const deleteAdoptante = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AdoptanteRepositoryORM(em);
        const casouso = new DeleteAdoptante(repo);
        
        const {valor:codVal, error:codError} = validarCodigo(req.params.numero_persona, 'numero_persona');
        if(codError || codVal === undefined){
            res.status(400).json({ error: codError });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar el adoptante', error.message);
            res.status(500).json({ error: "Error al eliminar el adoptante" });
            return;
        };
        console.error('Error desconocido al eliminar el adoptante', error);
        res.status(500).json({ error: "Error desconocido al eliminar el adoptante" });
        return;
    };
};