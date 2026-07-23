import { Router } from 'express';
import { verificarToken } from '../login/auth.middleware.js';
import { 
findAll,
getOne,
create,
update,
deleteFichaMedica
 } from './fichaMedica.controller.js';

export const fichaMedicaRouter = Router();

fichaMedicaRouter.get('/', verificarToken(["Colaborador", "Veterinario"]), findAll);
fichaMedicaRouter.get('/:nro_ficha', verificarToken(["Colaborador", "Veterinario"]), getOne);
fichaMedicaRouter.post('/', verificarToken(["Colaborador", "Veterinario"]), create);
fichaMedicaRouter.put('/:nro_ficha', verificarToken(["Colaborador", "Veterinario"]), update);
fichaMedicaRouter.delete('/:nro_ficha', verificarToken(["Colaborador", "Veterinario"]), deleteFichaMedica);