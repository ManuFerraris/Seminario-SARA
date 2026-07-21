import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { validarCodigo } from '../helpers/validarCodigo.js';
import { AdopcionRepositoryORM } from './adopcion.repositoryORM.js';
import { PersonaRepositoryORM } from '../persona/persona.repositoryORM.js';
import { AnimalRepositoryORM } from '../animal/animal.repositoryORM.js';
import { FindAllAdopcion } from './CU/findAllAdopcion.js';
import { GetOneAdopcion } from './CU/getOneAdopcion.js';
import { CreateAdopcion } from './CU/createAdopcion.js';
import { UpdateAdopcion } from './CU/updateAdopcion.js';

export const findAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AdopcionRepositoryORM(em);
        const casouso = new FindAllAdopcion(repo);

        const resultado = await casouso.ejecutar();

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar las adopciones', error.message);
            res.status(500).json({ error: "Error al buscar las adopciones" });
            return;
        }
        console.error('Error desconocido al buscar todas las adopciones', error);
        res.status(500).json({ error: "Error desconocido al buscar todas las adopciones" });
        return;
    }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AdopcionRepositoryORM(em);
        const casouso = new GetOneAdopcion(repo);

        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_adopcion, 'numero adopcion');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };

        const resultado = await casouso.ejecutar(codVal);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar la adopción', error.message);
            res.status(500).json({ error: "Error al buscar la adopción" });
            return;
        }
        console.error('Error desconocido al buscar la adopción', error);
        res.status(500).json({ error: "Error desconocido al buscar la adopción" });
        return;
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const adopcionRepo = new AdopcionRepositoryORM(em);
        const personaRepo = new PersonaRepositoryORM(em);
        const animalRepo = new AnimalRepositoryORM(em);
        
        const casouso = new CreateAdopcion(adopcionRepo, personaRepo, animalRepo);

        const resultado = await casouso.ejecutar(req.body);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al crear la adopción', error.message);
            res.status(500).json({ error: "Error al crear la adopción" });
            return;
        }
        console.error('Error desconocido al crear la adopción', error);
        res.status(500).json({ error: "Error desconocido al crear la adopción" });
        return;
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const {valor: codVal, error:codError} = validarCodigo(req.params.nro_adopcion, 'numero adopcion');
        if(codError || codVal === undefined){
            res.status(400).json({ message: codError , data: undefined });
            return;
        };
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        const repo = new AdopcionRepositoryORM(em);
        const casouso = new UpdateAdopcion(repo);

        const resultado = await casouso.ejecutar(codVal, req.body);

        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al actualizar la adopción', error.message);
            res.status(500).json({ error: "Error al actualizar la adopción" });
            return;
        }
        console.error('Error desconocido al actualizar la adopción', error);
        res.status(500).json({ error: "Error desconocido al actualizar la adopción" });
        return;
    }
};