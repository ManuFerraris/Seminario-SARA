import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { VacunaRepositoryORM } from "./vacuna.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { FindAllVacunas } from "./CU/findAllVacunas.js";
import { UpdateVacuna } from "./CU/updateVacuna.js";
import { CreateVacuna } from "./CU/createVacuna.js";
import { GetOneVacuna } from "./CU/getOneVacuna.js";
import { DeleteVacuna } from "./CU/deleteVacuna.js";

export const findAllVacunas = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VacunaRepositoryORM(em);
        const casouso = new FindAllVacunas(repo);
    
        const resultado = await casouso.ejecutar();
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar las vacunas', error.message);
            res.status(500).json({ error: "Error al buscar las vacunas" });
            return;
        };
        console.error('Error desconocido al buscar todas las vacunas', error);
        res.status(500).json({ error: "Error desconocido al buscar todas las vacunas" });
        return;
    };
};

export const getOneVacunas = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VacunaRepositoryORM(em);
        const casouso = new GetOneVacuna(repo);
        
        const { valor:codVal, error: codError } = validarCodigo(req.params.nro_vacuna, 'numero de vacuna');
        if (codError || codVal === undefined) {
            res.status(400).json({ error: codError });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al buscar la vacuna', error.message);
            res.status(500).json({ error: "Error al buscar la vacuna" });
            return;
        };
        console.error('Error desconocido al buscar la vacuna', error);
        res.status(500).json({ error: "Error desconocido al buscar la vacuna" });
        return;
    };
};

export const createVacunas = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VacunaRepositoryORM(em);
        const casouso = new CreateVacuna(repo);
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(dto);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al crear la vacuna', error.message);
            res.status(500).json({ error: "Error al crear la vacuna" });
            return;
        };
        console.error('Error desconocido al crear la vacuna', error);
        res.status(500).json({ error: "Error desconocido al crear la vacuna" });
        return;
    };
};

export const updateVacunas = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VacunaRepositoryORM(em);
        const casouso = new UpdateVacuna(repo);

        const { valor:codVal, error: codError } = validarCodigo(req.params.nro_vacuna, 'numero de vacuna');
        if (codError || codVal === undefined) {
            res.status(400).json({ error: codError });
            return;
        };
        
        const dto = req.body;
        console.log('DTO recibido en el controlador:', dto);
        const resultado = await casouso.ejecutar(codVal, dto);
        console.log('Resultado del caso de uso:', resultado);
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al actualizar la vacuna', error.message);
            res.status(500).json({ error: "Error al actualizar la vacuna" });
            return;
        };
        console.error('Error desconocido al actualizar la vacuna', error);
        res.status(500).json({ error: "Error desconocido al actualizar la vacuna" });
        return;
    };
};

export const deleteVacunas = async (req:Request, res:Response):Promise<void> => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new VacunaRepositoryORM(em);
        const casouso = new DeleteVacuna(repo);
        
        const { valor:codVal, error: codError } = validarCodigo(req.params.nro_vacuna, 'numero de vacuna');
        if (codError || codVal === undefined) {
            res.status(400).json({ error: codError });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);
    
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch(error:unknown){
        if (error instanceof Error) {
            console.error('Error al eliminar la vacuna', error.message);
            res.status(500).json({ error: "Error al eliminar la vacuna" });
            return;
        };
        console.error('Error desconocido al eliminar la vacuna', error);
        res.status(500).json({ error: "Error desconocido al eliminar la vacuna" });
        return;
    };
};