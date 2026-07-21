import { Router } from 'express';
import { 
findAll, 
getOne, 
create, 
update, 
deleteColocacion 
} from './colocacion.controller.js';

export const colocacionRouter = Router();
colocacionRouter.get('/', findAll);
colocacionRouter.get('/:nro_colocacion', getOne);
colocacionRouter.post('/', create);
colocacionRouter.put('/:nro_colocacion', update);
colocacionRouter.delete('/:nro_colocacion', deleteColocacion);