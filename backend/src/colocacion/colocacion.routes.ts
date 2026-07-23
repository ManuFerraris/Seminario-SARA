import { Router } from 'express';
import { verificarToken } from '../login/auth.middleware.js';
import { 
findAll, 
getOne, 
create, 
update, 
deleteColocacion 
} from './colocacion.controller.js';

export const colocacionRouter = Router();
colocacionRouter.get('/', verificarToken(["Colaborador", "Veterinario"]), findAll);
colocacionRouter.get('/:nro_colocacion', verificarToken(["Colaborador", "Veterinario"]), getOne);
colocacionRouter.post('/', verificarToken(["Colaborador", "Veterinario"]), create);
colocacionRouter.put('/:nro_colocacion', verificarToken(["Colaborador", "Veterinario"]), update);
colocacionRouter.delete('/:nro_colocacion', verificarToken(["Colaborador", "Veterinario"]), deleteColocacion);