import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { EntrevistaRepositoryORM } from "./entrevista.repositoryORM.js";
import { ColaboradorRepositoryORM } from "../persona/colaborador/colaborador.repositoryORM.js";
import { AdoptanteRepositoryORM } from "../persona/adoptante/adoptante.repositotyORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { GetOneEntrevista } from "./CU/getOneEntrevista.js";
import { FindAllEntrevistas } from "./CU/findAllEntrevistas.js";
import { DeleteEntrevista } from "./CU/deleteEntrevista.js";
import { CreateEntrevista } from "./CU/createEntrevista.js";
import { UpdateEntrevista } from "./CU/updateEntrevista.js";
import { BajaLogicaEntrevista } from "./CU/bajaLogicaEntrevista.js";

export const findAllEntrevistas = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const entRepo = new EntrevistaRepositoryORM(em);
        const colabRepo = new ColaboradorRepositoryORM(em);
        const adoptRepo = new AdoptanteRepositoryORM(em);
        
        const casoUso = new FindAllEntrevistas(entRepo);
        const resultado = await casoUso.ejecutar();
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar las entrevistas', error.message);
            res.status(500).json({ error: "Error al buscar las entrevistas" });
            return;
        }
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
};

export const getOneEntrevista = async (req: Request, res: Response) => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const entRepo = new EntrevistaRepositoryORM(em);
        const colabRepo = new ColaboradorRepositoryORM(em);
        const adoptRepo = new AdoptanteRepositoryORM(em);
        
        const casoUso = new GetOneEntrevista(entRepo, colabRepo, adoptRepo);
        
        const fecha_hora_str = req.params.fecha_hora as string;
        const fecha_hora = new Date(fecha_hora_str);
        const id_colaborador = String(req.params.id_colaborador);
        const {valor:codValA, error:codErrorA} = validarCodigo(req.params.numero_adoptante, "adoptante");
        if (codErrorA || codValA === undefined) {
            res.status(400).json({ error: codErrorA });
            return;
        };

        if (isNaN(fecha_hora.getTime())) {
            res.status(400).json({ error: "Formato de fecha y hora inválido en la URL." });
            return;
        }

        const resultado = await casoUso.ejecutar(id_colaborador, codValA, fecha_hora);
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar la entrevista', error.message);
            res.status(500).json({ error: "Error al buscar la entrevista" });
            return;
        }
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
};

export const createEntrevista = async (req: Request, res: Response) => {
try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const entRepo = new EntrevistaRepositoryORM(em);
        const colabRepo = new ColaboradorRepositoryORM(em);
        const adoptRepo = new AdoptanteRepositoryORM(em);
        
        const casoUso = new CreateEntrevista(entRepo, colabRepo, adoptRepo);
        const dto = req.body;

        const resultado = await casoUso.ejecutar(dto);
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al crear la entrevista', error.message);
            res.status(500).json({ error: "Error al crear la entrevista" });
            return;
        }
        console.error('Error desconocido al crear la entrevista', error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
};

export const updateEntrevista = async (req: Request, res: Response) => {
try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const entRepo = new EntrevistaRepositoryORM(em);
        const colabRepo = new ColaboradorRepositoryORM(em);
        const adoptRepo = new AdoptanteRepositoryORM(em);
        
        const casoUso = new UpdateEntrevista(entRepo, colabRepo, adoptRepo);
        
        // Extraemos los identificadores de la URL

        const id_colaborador = String(req.params.id_colaborador);
        const fecha_hora_str = req.params.fecha_hora as string;
        const fecha_hora = new Date(fecha_hora_str);
        const dto = req.body;

        const {valor:codValA, error:codErrorA} = validarCodigo(req.params.numero_adoptante, "adoptante");
        if (codErrorA || codValA === undefined) {
            res.status(400).json({ error: codErrorA });
            return;
        };

        if (isNaN(fecha_hora.getTime())) {
            res.status(400).json({ error: "Formato de fecha y hora inválido en la URL." });
            return;
        };

        const resultado = await casoUso.ejecutar(codValA, id_colaborador, fecha_hora, dto);
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al actualizar la entrevista', error.message);
            res.status(500).json({ error: "Error al actualizar la entrevista" });
            return;
        }
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
};

export const deleteEntrevista = async (req: Request, res: Response) => {
    try{   
        const resultado = {
            status: 200,
            success: true,
            messages: ['No se crea el delete de entrevista por seguridad'],
            data: undefined,
        };
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    }catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al eliminar la entrevista', error.message);
            res.status(500).json({ error: "Error al eliminar la entrevista" });
            return;
        }
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
};

export const bajaLogicaEntrevista = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const entRepo = new EntrevistaRepositoryORM(em);
        const colabRepo = new ColaboradorRepositoryORM(em);
        const adoptRepo = new AdoptanteRepositoryORM(em);
        
        const casoUso = new BajaLogicaEntrevista(entRepo, colabRepo, adoptRepo);
        
        // Extraemos y validamos los parámetros de la PK compuesta
        const fecha_hora_str = req.params.fecha_hora as string;
        const fecha_hora = new Date(fecha_hora_str);
        
        const id_colaborador = String(req.params.id_colaborador);

        const { valor: codValA, error: codErrorA } = validarCodigo(req.params.numero_adoptante, "adoptante");
        if (codErrorA || codValA === undefined) {
            res.status(400).json({ error: codErrorA });
            return;
        }

        if (isNaN(fecha_hora.getTime())) {
            res.status(400).json({ error: "Formato de fecha y hora inválido en la URL." });
            return;
        }

        // Ejecutamos la baja lógica
        const resultado = await casoUso.ejecutar(codValA, id_colaborador, fecha_hora);
        
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al dar de baja la entrevista', error.message);
            res.status(500).json({ error: "Error interno al intentar dar de baja la entrevista" });
            return;
        }
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
};