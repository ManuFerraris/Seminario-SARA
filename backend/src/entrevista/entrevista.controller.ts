import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { EntrevistaRepositoryORM } from "./entrevista.repositoryORM.js";
import { PersonaRepositoryORM } from "../persona/persona.repositoryORM.js";
import { validarCodigo } from "../helpers/validarCodigo.js";
import { GetOneEntrevista } from "./CU/getOneEntrevista.js";
import { FindAllEntrevistas } from "./CU/findAllEntrevistas.js";
import { CreateEntrevista } from "./CU/createEntrevista.js";
import { UpdateEntrevista } from "./CU/updateEntrevista.js";
import { BajaLogicaEntrevista } from "./CU/bajaLogicaEntrevista.js";
import { AltaEntrevistaCU, AltaEntrevistaDTO } from "./CU/altaEntrevistaCU.js";
import { AnimalRepositoryORM } from "../animal/animal.repositoryORM.js";

export const findAllEntrevistas = async (req: Request, res: Response) => {
    try{
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        const entRepo = new EntrevistaRepositoryORM(em);
        
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
        
        const casoUso = new GetOneEntrevista(entRepo);
        
        const {valor:codVaEnt, error:codErrorEnt} = validarCodigo(req.params.id_entrevista, "nro entrevista");
        if (codErrorEnt || codVaEnt === undefined) {
            res.status(400).json({ error: codErrorEnt });
            return;
        };

        const resultado = await casoUso.ejecutar(codVaEnt);
        res.status(resultado.status).json({ message: resultado.messages, data: resultado.data });
        return;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al buscar la entrevista:', error.message);
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
        const personaRepo = new PersonaRepositoryORM(em); // Nuevo repo inyectado
        
        // El caso de uso ahora recibe ambos repositorios
        const casoUso = new CreateEntrevista(entRepo, personaRepo);
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
        
        // Asumiendo que la actualización no cambia a las personas, 
        // solo necesitas el repo de entrevista
        const casoUso = new UpdateEntrevista(entRepo);
        const dto = req.body;

        // Extraemos y validamos la única PK necesaria
        const { valor: codVaEnt, error: codErrorEnt } = validarCodigo(req.params.id_entrevista, "nro entrevista");
        
        if (codErrorEnt || codVaEnt === undefined) {
            res.status(400).json({ error: codErrorEnt });
            return;
        }

        const resultado = await casoUso.ejecutar(codVaEnt, dto);
        
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
        const casoUso = new BajaLogicaEntrevista(entRepo);
        
        // Validamos la PK única
        const { valor: codVaEnt, error: codErrorEnt } = validarCodigo(req.params.id_entrevista, "nro entrevista");
        
        if (codErrorEnt || codVaEnt === undefined) {
            res.status(400).json({ error: codErrorEnt });
            return;
        }

        // Ejecutamos la baja lógica enviando solo el ID
        const resultado = await casoUso.ejecutar(codVaEnt);
        
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

export const registrarEntrevista = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        // Instanciamos los repositorios
        const adoptanteRepo = new PersonaRepositoryORM(em);
        const animalRepo = new AnimalRepositoryORM(em);
        const entrevistaRepo = new EntrevistaRepositoryORM(em);
        const casoUso = new AltaEntrevistaCU(adoptanteRepo, animalRepo, entrevistaRepo, em);

        const { nro_animal, fecha_entrevista, hora_entrevista, dni_adoptante } = req.body;

        const fechaString = `${fecha_entrevista}T${hora_entrevista}:00`;

        // Armamos el DTO
        const dto = {
            dni_adoptante: dni_adoptante,
            dni_colaborador: "22222222",
            nro_animal: parseInt(nro_animal, 10),
            fecha_hora: new Date(fechaString),
            estado: "Pendiente",
        };

        // Ejecutamos
        console.log('DTO recibido en el controlador registrarEntrevista:', dto);
        const resultado = await casoUso.ejecutar(dto);
        console.log('Resultado del caso de uso registrarEntrevista:', resultado);
        res.status(resultado.status).json({ 
            success: resultado.success, 
            messages: resultado.messages, 
            data: resultado.data 
        });
        return;

    } catch (error: unknown) {
        console.error('Error crítico en controlador registrarEntrevista:', error);
        res.status(500).json({ 
            success: false, 
            messages: ["Error interno del servidor al procesar la entrevista."] 
        });
        return;
    }
};