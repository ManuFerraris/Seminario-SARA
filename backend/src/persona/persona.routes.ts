import { Router } from "express";
import {
    findAll,
    getOne,
    create,
    update,
    deletePersona
} from "./persona.controller.js";

export const personaRouter = Router();

personaRouter.get('/', findAll);
personaRouter.get('/:dni', getOne);
personaRouter.post('/', create);
personaRouter.put('/:dni', update);
personaRouter.delete('/:dni', deletePersona);