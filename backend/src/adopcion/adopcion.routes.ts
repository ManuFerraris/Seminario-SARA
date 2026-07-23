import { Router } from 'express';
import { verificarToken } from '../login/auth.middleware.js';
import {
    findAll,
    getOne,
    create,
    update
 } from './adopcion.controller.js';
export const adopcionRouter = Router();

adopcionRouter.get('/', verificarToken(["Colaborador", "Veterinario"]), findAll);
adopcionRouter.get('/:nro_adopcion', verificarToken(["Colaborador", "Veterinario"]), getOne);
adopcionRouter.post('/', verificarToken(["Colaborador", "Veterinario"]), create);
adopcionRouter.put('/:nro_adopcion', verificarToken(["Colaborador", "Veterinario"]), update);