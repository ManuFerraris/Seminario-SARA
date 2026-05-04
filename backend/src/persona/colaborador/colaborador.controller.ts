import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { ColaboradorRepositoryORM } from "./colaborador.repositoryORM.js";
import { PersonaRepositoryORM } from "../persona.repositoryORM.js";
import { validarCodigo } from "../../helpers/validarCodigo.js";
import { FindAllColaborador } from "./CU/findAllColaborador.js";
import { GetOneColaborador } from "./CU/getOneColaborador.js";
import { DeleteColaborador } from "./CU/deleteColaborador.js";
import { CreateColaborador } from "./CU/createColaborador.js";

export const findAll = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColaboradorRepositoryORM(em);
        const casouso = new FindAllColaborador(repo);
            
        const resultado = await casouso.ejecutar();
            
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar los colaboradores', error.message);
            res.status(500).json({ error: "Error al buscar los colaboradores" });
            return;
        };
        console.error('Error desconocido al buscar todos los colaboradores', error);
        res.status(500).json({ error: "Error desconocido al buscar todos los colaboradores" });
        return;
    };
};

export const getOne = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColaboradorRepositoryORM(em);
        const casouso = new GetOneColaborador(repo);
        
        const id_colaborador = String(req.params.id);
        console.log('ID de colaborador recibido para búsqueda:', id_colaborador);
        
        const resultado = await casouso.ejecutar(id_colaborador);
            
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar el colaborador', error.message);
            res.status(500).json({ error: "Error al buscar el colaborador" });
            return;
        };
        console.error('Error desconocido al buscar el colaborador', error);
        res.status(500).json({ error: "Error desconocido al buscar el colaborador" });
        return;
    };
};

export async function create(req:Request, res:Response):Promise<void> {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const colaboradorRepo = new ColaboradorRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const casouso = new CreateColaborador(colaboradorRepo, personaRepo);
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el colaborador', error.message);
            res.status(500).json({ error: "Error al crear el colaborador" });
            return;
        };
        console.error('Error desconocido al crear el colaborador', error);
        res.status(500).json({ error: "Error desconocido al crear el colaborador" });
        return;
    };
};

export async function update(req:Request, res:Response):Promise<void> {
    res.status(501).json({ error: "Funcionalidad no implementada" });
};

export async function deleteColaborador(req:Request, res:Response):Promise<void> {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColaboradorRepositoryORM(em);
        const casouso = new DeleteColaborador(repo);
        
        const id_colaborador = String(req.params.id);
        console.log('ID de colaborador recibido para eliminación:', id_colaborador);
        const resultado = await casouso.ejecutar(id_colaborador);
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar el colaborador', error.message);
            res.status(500).json({ error: "Error al eliminar el colaborador" });
            return;
        };
        console.error('Error desconocido al eliminar el colaborador', error);
        res.status(500).json({ error: "Error desconocido al eliminar el colaborador" });
        return;
    };
};