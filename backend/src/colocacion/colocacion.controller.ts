import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { ColocacionRepositoryORM } from "./colocacion.repositoryORM.js";
import { VacunaRepositoryORM } from "../vacuna/vacuna.repositoryORM.js";
import { FichaMedicaRepositoryORM } from "../fichaMedica/fichaMedica.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAllColocacion } from "./CU/findAllColocacion.js";
import { GetOneColocacion } from "./CU/getOneColocacion.js";
import { CreateColocacion } from "./CU/createColocacion.js";
import { UpdateColocacion } from "./CU/updateColocacion.js";
import { DeleteColocacion } from "./CU/deleteColocacion.js";

export const findAll = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColocacionRepositoryORM(em);
        const casouso = new FindAllColocacion(repo);

        const resultado = await casouso.ejecutar();

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar las colocaciones', error.message);
            res.status(500).json({ error: "Error al buscar las colocaciones" });
            return;
        }
        console.error('Error desconocido al buscar todos las colocaciones', error);
        res.status(500).json({ error: "Error desconocido al buscar todos las colocaciones" });
        return;
    };
};

export const getOne = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColocacionRepositoryORM(em);
        const casouso = new GetOneColocacion(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_colocacion, 'numero colocacion');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };
        
        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar la colocacion', error.message);
            res.status(500).json({ error: "Error al buscar la colocacion" });
            return;
        };
        console.error('Error desconocido al buscar la colocacion', error);
        res.status(500).json({ error: "Error desconocido al buscar la colocacion" });
        return;
    }
}

export const create = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const colocacionRepo = new ColocacionRepositoryORM(em);
        const vacunaRepo = new VacunaRepositoryORM(em);
        const fichaRepo = new FichaMedicaRepositoryORM(em);

        const casouso = new CreateColocacion(colocacionRepo, fichaRepo, vacunaRepo);

        const dto = req.body;
        // console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear la colocacion', error.message);
            res.status(500).json({ error: "Error al crear la colocacion" });
            return;
        };
        console.error('Error desconocido al crear la colocacion', error);
        res.status(500).json({ error: "Error desconocido al crear la colocacion" });
        return;
    }
};

export const update = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColocacionRepositoryORM(em);
        const fichaRepo = new FichaMedicaRepositoryORM(em);
        const vacunaRepo = new VacunaRepositoryORM(em);
        const casouso = new UpdateColocacion(repo, fichaRepo, vacunaRepo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_colocacion, 'numero de colocacion');
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
            console.error('Error al actualizar la colocacion', error.message);
            res.status(500).json({ error: "Error al actualizar la colocacion" });
            return;
        };
        console.error('Error desconocido al actualizar la colocacion', error);
        res.status(500).json({ error: "Error desconocido al actualizar la colocacion" });
        return;
    }
};

export const deleteColocacion = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new ColocacionRepositoryORM(em);
        const casouso = new DeleteColocacion(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_colocacion, 'numero de colocacion');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar la colocacion', error.message);
            res.status(500).json({ error: "Error al eliminar la colocacion" });
            return;
        };
        console.error('Error desconocido al eliminar la colocacion', error);
        res.status(500).json({ error: "Error desconocido al eliminar la colocacion" });
        return;
    }
};