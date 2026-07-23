import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
    findAll,
    getOne,
    create,
    update,
    deletePersona
} from "./persona.controller.js";

export const personaRouter = Router();

personaRouter.get('/', verificarToken(["Colaborador", "Veterinario"]), findAll);
personaRouter.get('/:dni', verificarToken(["Colaborador", "Veterinario"]), getOne);
personaRouter.post('/', verificarToken(["Colaborador", "Veterinario"]), create);
personaRouter.put('/:dni', verificarToken(["Colaborador", "Veterinario"]), update);
personaRouter.delete('/:dni', verificarToken(["Colaborador", "Veterinario"]), deletePersona);