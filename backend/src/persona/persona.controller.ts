import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { PersonaRepositoryORM } from "./persona.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAll } from "./CU/findAll.js";
import { GetOne } from "./CU/getOne.js";
import { CreatePersona } from "./CU/createPersona.js";
import { UpdatePersona } from "./CU/update.js";
import { DeletePersona } from "./CU/deletePersona.js";

export const findAll = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new PersonaRepositoryORM(em);
        const casouso = new FindAll(repo);
    
        const resultado = await casouso.ejecutar();
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar las personas', error.message);
            res.status(500).json({ error: "Error al buscar las personas" });
            return;
        };
        console.error('Error desconocido al buscar todas las personas', error);
        res.status(500).json({ error: "Error desconocido al buscar todas las personas" });
        return;
    };
};

export const getOne = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new PersonaRepositoryORM(em);
        const casouso = new GetOne(repo);
        
        const { valor:codVal, error: codError } = validarCodigo(req.params.numero, 'numero de persona');
        if (codError || codVal === undefined) {
            res.status(400).json({ error: codError });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar la persona', error.message);
            res.status(500).json({ error: "Error al buscar la persona" });
            return;
        };
        console.error('Error desconocido al buscar la persona', error);
        res.status(500).json({ error: "Error desconocido al buscar la persona" });
        return;
    };
};

export const create = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new PersonaRepositoryORM(em);
        const casouso = new CreatePersona(repo);
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear la persona', error.message);
            res.status(500).json({ error: "Error al crear la persona" });
            return;
        };
        console.error('Error desconocido al crear la persona', error);
        res.status(500).json({ error: "Error desconocido al crear la persona" });
        return;
    };
};

export const update = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new PersonaRepositoryORM(em);
        const casouso = new UpdatePersona(repo);

        const { valor:codVal, error: codError } = validarCodigo(req.params.numero, 'numero de persona');
        if (codError || codVal === undefined) {
            res.status(400).json({ error: codError });
            return;
        };
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(codVal, dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al actualizar la persona', error.message);
            res.status(500).json({ error: "Error al actualizar la persona" });
            return;
        };
        console.error('Error desconocido al actualizar la persona', error);
        res.status(500).json({ error: "Error desconocido al actualizar la persona" });
        return;
    };
};

export const deletePersona = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new PersonaRepositoryORM(em);
        const casouso = new DeletePersona(repo);
        
        const { valor:codVal, error: codError } = validarCodigo(req.params.numero, 'numero de persona');
        if (codError || codVal === undefined) {
            res.status(400).json({ error: codError });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar la persona', error.message);
            res.status(500).json({ error: "Error al eliminar la persona" });
            return;
        };
        console.error('Error desconocido al eliminar la persona', error);
        res.status(500).json({ error: "Error desconocido al eliminar la persona" });
        return;
    };
};