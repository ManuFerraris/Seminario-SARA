import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { validarCodigo } from "../../helpers/validarCodigo.js";
import { PersonaRepositoryORM } from "../persona.repositoryORM.js";
import { VeterinarioRepositoryORM } from "./veterinarioRepositoryORM.js";
import { FindAllVeterinario } from "./CU/findAllVeterinario.js";
import { GetOneVeterinario } from "./CU/getOneVeterinario.js";
import { DeleteVeterinario } from "./CU/deleteVeterinario.js";
import { CreateVeterinario } from "./CU/createVeterinario.js";
import { UpdateVeterinario } from "./CU/uptadeVeterinario.js";

export const findAll = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VeterinarioRepositoryORM(em);
        const casouso = new FindAllVeterinario(repo);
            
        const resultado = await casouso.ejecutar();
            
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar los veterinarios', error.message);
            res.status(500).json({ error: "Error al buscar los veterinarios" });
            return;
        };
        console.error('Error desconocido al buscar todos los veterinarios', error);
        res.status(500).json({ error: "Error desconocido al buscar todos los veterinarios" });
        return;
    };
};

export const getOne = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VeterinarioRepositoryORM(em);
        const casouso = new GetOneVeterinario(repo);
        
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
            console.error('Error al buscar el veterinario', error.message);
            res.status(500).json({ error: "Error al buscar el veterinario" });
            return;
        };
        console.error('Error desconocido al buscar el veterinario', error);
        res.status(500).json({ error: "Error desconocido al buscar el veterinario" });
        return;
    };
};

export const create = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const veterinarioRepo = new VeterinarioRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const casouso = new CreateVeterinario(veterinarioRepo, personaRepo);

        const dto = req.body;

        const resultado = await casouso.ejecutar(dto);
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el veterinario', error.message);
            res.status(500).json({ error: "Error al crear el veterinario" });
            return;
        };
        console.error('Error desconocido al crear el veterinario', error);
        res.status(500).json({ error: "Error desconocido al crear el veterinario" });
        return;
    }
};

export const update = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const veterinarioRepo = new VeterinarioRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const casouso = new UpdateVeterinario(veterinarioRepo, personaRepo);

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
            console.error('Error al actualizar el veterinario', error.message);
            res.status(500).json({ error: "Error al actualizar el veterinario" });
            return;
        };
        console.error('Error desconocido al actualizar el veterinario', error);
        res.status(500).json({ error: "Error desconocido al actualizar el veterinario" });
        return;
    }
};

export const deleteVeterinario = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VeterinarioRepositoryORM(em);
        const casouso = new DeleteVeterinario(repo);
        
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
            console.error('Error al eliminar el veterinario', error.message);
            res.status(500).json({ error: "Error al eliminar el veterinario" });
            return;
        };
        console.error('Error desconocido al eliminar el veterinario', error);
        res.status(500).json({ error: "Error desconocido al eliminar el veterinario" });
        return;
    };
};