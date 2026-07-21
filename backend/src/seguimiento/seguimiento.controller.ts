import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { SeguimientoRepositoryORM } from "./seg.repositoryORM.js";
import { FindAllSeguimiento } from "./CU/findAllSeg.js";
import { GetOneSeguimiento } from "./CU/getOneSeg.js";
import { AdopcionRepositoryORM } from "../adopcion/adopcion.repositoryORM.js";
import { CreateSeguimiento } from "./CU/createSeg.js";
import { UpdateSeguimiento } from "./CU/updateSeg.js";
import { DeleteSeguimiento } from "./CU/deleteSeg.js";


export const findAll = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new SeguimientoRepositoryORM(em);
        const casouso = new FindAllSeguimiento(repo);

        const resultado = await casouso.ejecutar();

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar los seguimientos', error.message);
            res.status(500).json({ error: "Error al buscar los seguimientos" });
            return;
        }
        console.error('Error desconocido al buscar todos los seguimientos', error);
        res.status(500).json({ error: "Error desconocido al buscar todos los seguimientos" });
        return;
    };
};

export const getOne = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new SeguimientoRepositoryORM(em);
        const casouso = new GetOneSeguimiento(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_seguimiento, 'numero de seguimiento');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };
        
        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar el seguimiento', error.message);
            res.status(500).json({ error: "Error al buscar el seguimiento" });
            return;
        };
        console.error('Error desconocido al buscar el seguimiento', error);
        res.status(500).json({ error: "Error desconocido al buscar el seguimiento" });
        return;
    }
}

export const create = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const segRepo = new SeguimientoRepositoryORM(em);
        const adopcionRepo = new AdopcionRepositoryORM(em);

        const casouso = new CreateSeguimiento(segRepo, adopcionRepo);

        const dto = req.body;
        // console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear el seguimiento', error.message);
            res.status(500).json({ error: "Error al crear el seguimiento" });
            return;
        };
        console.error('Error desconocido al crear el seguimiento', error);
        res.status(500).json({ error: "Error desconocido al crear el seguimiento" });
        return;
    }
};

export const update = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const segRepo = new SeguimientoRepositoryORM(em);
        const adopcionRepo = new AdopcionRepositoryORM(em);
        const casouso = new UpdateSeguimiento(segRepo, adopcionRepo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_seguimiento, 'numero de seguimiento');
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
            console.error('Error al actualizar el seguimiento', error.message);
            res.status(500).json({ error: "Error al actualizar el seguimiento" });
            return;
        };
        console.error('Error desconocido al actualizar el seguimiento', error);
        res.status(500).json({ error: "Error desconocido al actualizar el seguimiento" });
        return;
    }
};

export const deleteSeguimiento = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new SeguimientoRepositoryORM(em);
        const casouso = new DeleteSeguimiento(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_seguimiento, 'numero de seguimiento');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar el seguimiento', error.message);
            res.status(500).json({ error: "Error al eliminar el seguimiento" });
            return;
        };
        console.error('Error desconocido al eliminar el seguimiento', error);
        res.status(500).json({ error: "Error desconocido al eliminar el seguimiento" });
        return;
    }
};