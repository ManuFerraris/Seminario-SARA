import multer from 'multer';
import { Router } from 'express';
import { verificarToken } from '../login/auth.middleware.js';
import { registrarRetiroAiven } from '../retiro/retiroController.js';
import {
    findAll,
    getOne,
    create,
    update
 } from './adopcion.controller.js';

const upload = multer({ storage: multer.memoryStorage() });

export const adopcionRouter = Router();

adopcionRouter.get('/', verificarToken(["Colaborador", "Veterinario"]), findAll);
adopcionRouter.get('/:nro_adopcion', verificarToken(["Colaborador", "Veterinario"]), getOne);
adopcionRouter.post('/registrar', /*verificarToken(["Colaborador", "Veterinario"]),*/ create);
adopcionRouter.put('/:nro_adopcion', verificarToken(["Colaborador", "Veterinario"]), update);
adopcionRouter.put(
    '/:nro_adopcion/retiro', 
    verificarToken(["Colaborador", "Veterinario"]),
    upload.array('archivos'),
    registrarRetiroAiven);