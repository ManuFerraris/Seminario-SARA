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
personaRouter.get('/:numero', getOne);
personaRouter.post('/', create);
personaRouter.put('/:numero', update);
personaRouter.delete('/:numero', deletePersona);