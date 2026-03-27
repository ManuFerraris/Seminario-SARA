import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { AnimalRepositoryORM } from "./animal.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAll } from "./CU/findAll.js";
import { GetOne } from "./CU/getOne.js";
import { CrearAnimal } from "./CU/crearAnimal.js";
import { ActualizarAnimal } from "./CU/actualizarAnimal.js";
import { EliminarAnimal } from "./CU/eliminarAnimal.js";

export const findAll = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AnimalRepositoryORM(em);
        const casouso = new FindAll(repo);

        const resultado = await casouso.ejecutar();

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar los animales', error.message);
            res.status(500).json({ error: "Error al buscar los animales" });
            return;
        }
        console.error('Error desconocido al buscar todos los animales', error);
        res.status(500).json({ error: "Error desconocido al buscar todos los animales" });
        return;
    };
};

export const getOne = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AnimalRepositoryORM(em);
        const casouso = new GetOne(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params, 'numero animal');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };
        
        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar el animal', error.message);
            res.status(500).json({ error: "Error al buscar el animal" });
            return;
        };
        console.error('Error desconocido al buscar el animal', error);
        res.status(500).json({ error: "Error desconocido al buscar el animal" });
        return;
    }
}

export const create = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AnimalRepositoryORM(em);
        const casouso = new CrearAnimal(repo);

        const dto = req.body;
        // console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el animal', error.message);
            res.status(500).json({ error: "Error al crear el animal" });
            return;
        };
        console.error('Error desconocido al crear el animal', error);
        res.status(500).json({ error: "Error desconocido al crear el animal" });
        return;
    }
};

export const update = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AnimalRepositoryORM(em);
        const casouso = new ActualizarAnimal(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.numero, 'numero animal');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);

        const resultado = await casouso.ejecutar(dto, codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al actualizar el animal', error.message);
            res.status(500).json({ error: "Error al actualizar el animal" });
            return;
        };
        console.error('Error desconocido al actualizar el animal', error);
        res.status(500).json({ error: "Error desconocido al actualizar el animal" });
        return;
    }
};

export const deleteAnimal = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AnimalRepositoryORM(em);
        const casouso = new EliminarAnimal(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.numero, 'numero animal');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar el animal', error.message);
            res.status(500).json({ error: "Error al eliminar el animal" });
            return;
        };
        console.error('Error desconocido al eliminar el animal', error);
        res.status(500).json({ error: "Error desconocido al eliminar el animal" });
        return;
    }
};