import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { FichaMedicaRepositoryORM } from "../fichaMedica/fichaMedica.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAllFichaMedica } from "../fichaMedica/CU/findAllFM.js";
import { GetOneFichaMedica } from "../fichaMedica/CU/getOneFM.js";
import { CreateFichaMedica } from "../fichaMedica/CU/createFM.js";
import { UpdateFichaMedica } from "../fichaMedica/CU/updateFM.js";
import { DeleteFichaMedica } from "../fichaMedica/CU/deleteFM.js";
import { AnimalRepositoryORM } from "../animal/animal.repositoryORM.js";
import { PersonaRepositoryORM } from "../persona/persona.repositoryORM.js";

export const findAll = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new FichaMedicaRepositoryORM(em);
        const casouso = new FindAllFichaMedica(repo);

        const resultado = await casouso.ejecutar();

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar las fichas medicas', error.message);
            res.status(500).json({ error: "Error al buscar las fichas medicas" });
            return;
        }
        console.error('Error desconocido al buscar todos las fichas medicas', error);
        res.status(500).json({ error: "Error desconocido al buscar todos las fichas medicas" });
        return;
    };
};

export const getOne = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new FichaMedicaRepositoryORM(em);
        const casouso = new GetOneFichaMedica(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_ficha, 'numero ficha');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };
        
        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar la ficha médica', error.message);
            res.status(500).json({ error: "Error al buscar la ficha médica" });
            return;
        };
        console.error('Error desconocido al buscar la ficha médica', error);
        res.status(500).json({ error: "Error desconocido al buscar la ficha médica" });
        return;
    }
}

export const create = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const animalRepo = new AnimalRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const fichaRepo = new FichaMedicaRepositoryORM(em);

        const casouso = new CreateFichaMedica(fichaRepo, animalRepo, personaRepo);

        const dto = req.body;
        // console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear la ficha médica', error.message);
            res.status(500).json({ error: "Error al crear la ficha médica" });
            return;
        };
        console.error('Error desconocido al crear la ficha médica', error);
        res.status(500).json({ error: "Error desconocido al crear la ficha médica" });
        return;
    }
};

export const update = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new FichaMedicaRepositoryORM(em);
        const animalRepo = new AnimalRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const casouso = new UpdateFichaMedica(repo, animalRepo, personaRepo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_ficha, 'numero de ficha');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);

        const resultado = await casouso.ejecutar(codVal, dto);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al actualizar la ficha médica', error.message);
            res.status(500).json({ error: "Error al actualizar la ficha médica" });
            return;
        };
        console.error('Error desconocido al actualizar la ficha médica', error);
        res.status(500).json({ error: "Error desconocido al actualizar la ficha médica" });
        return;
    }
};

export const deleteFichaMedica = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new FichaMedicaRepositoryORM(em);
        const casouso = new DeleteFichaMedica(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_ficha, 'numero de ficha');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar la ficha médica', error.message);
            res.status(500).json({ error: "Error al eliminar la ficha médica" });
            return;
        };
        console.error('Error desconocido al eliminar la ficha médica', error);
        res.status(500).json({ error: "Error desconocido al eliminar la ficha médica" });
        return;
    }
};