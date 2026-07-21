import { Router } from 'express';
import { 
findAll,
getOne,
create,
update,
deleteFichaMedica
 } from './fichaMedica.controller.js';

export const fichaMedicaRouter = Router();

fichaMedicaRouter.get('/', findAll);
fichaMedicaRouter.get('/:nro_ficha', getOne);
fichaMedicaRouter.post('/', create);
fichaMedicaRouter.put('/:nro_ficha', update);
fichaMedicaRouter.delete('/:nro_ficha', deleteFichaMedica);