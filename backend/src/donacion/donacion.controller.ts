import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { DonacionRepositoryORM } from "./donacion.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAllDonaciones } from "./CU/findAllDonaciones.js";
import { GetOneDonacion } from "./CU/getOneDonaciones.js";
import { CreateDonacion } from "./CU/createDonacion.js";
import { UpdateDonacion } from "./CU/updateDonacion.js";
import { DeleteDonacion } from "./CU/deleteDonacion.js";

export const findAllDonaciones = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new DonacionRepositoryORM(em);
        const casouso = new FindAllDonaciones(repo);
    
        const resultado = await casouso.ejecutar();
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar las donaciones', error.message);
            res.status(500).json({ error: "Error al buscar las donaciones" });
            return;
        };
        console.error('Error desconocido al buscar todas las donaciones', error);
        res.status(500).json({ error: "Error desconocido al buscar todas las donaciones" });
        return;
    };
};

export const getOneDonacion = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new DonacionRepositoryORM(em);
        const casouso = new GetOneDonacion(repo);

        const {valor:codVal, error: codErr} = validarCodigo(req.params.numero, 'numero de donación');
        if(codErr || codVal === undefined){
            res.status(400).json({ error: codErr });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar la donación', error.message);
            res.status(500).json({ error: "Error al buscar la donación" });
            return;
        };
        console.error('Error desconocido al buscar la donación', error);
        res.status(500).json({ error: "Error desconocido al buscar la donación" });
        return;
    };
};

export const createDonacion = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new DonacionRepositoryORM(em);
        const casouso = new CreateDonacion(repo);
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear la donación', error.message);
            res.status(500).json({ error: "Error al crear la donación" });
            return;
        };
        console.error('Error desconocido al crear la donación', error);
        res.status(500).json({ error: "Error desconocido al crear la donación" });
        return;
    };
};

export const updateDonacion = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new DonacionRepositoryORM(em);
        const casouso = new UpdateDonacion(repo);

        const {valor:codVal, error: codErr} = validarCodigo(req.params.numero, 'numero de donación');
        if(codErr || codVal === undefined){
            res.status(400).json({ error: codErr });
            return;
        };
        const dto = req.body;

        const resultado = await casouso.ejecutar(dto, codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al actualizar la donación', error.message);
            res.status(500).json({ error: "Error al actualizar la donación" });
            return;
        };
        console.error('Error desconocido al actualizar la donación', error);
        res.status(500).json({ error: "Error desconocido al actualizar la donación" });
        return;
    };
};

export const deleteDonacion = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new DonacionRepositoryORM(em);
        const casouso = new DeleteDonacion(repo);

        const {valor:codVal, error: codErr} = validarCodigo(req.params.numero, 'numero de donación');
        if(codErr || codVal === undefined){
            res.status(400).json({ error: codErr });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar la donación', error.message);
            res.status(500).json({ error: "Error al eliminar la donación" });
            return;
        };
        console.error('Error desconocido al eliminar la donación', error);
        res.status(500).json({ error: "Error desconocido al eliminar la donación" });
        return;
    };
};