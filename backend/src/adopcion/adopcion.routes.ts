import { Router } from 'express';
import {
    findAll,
    getOne,
    create,
    update
 } from './adopcion.controller.js';

export const adopcionRouter = Router();

adopcionRouter.get('/', findAll);
adopcionRouter.get('/:nro_adopcion', getOne);
adopcionRouter.post('/', create);
adopcionRouter.put('/:nro_adopcion', update);