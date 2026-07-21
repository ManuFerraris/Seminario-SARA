import { Router } from "express";
import { 
findAll,
getOne,
create,
update,
deleteSeguimiento 
} from "./seguimiento.controller.js";

export const seguimientoRouter = Router();

seguimientoRouter.get('/', findAll);
seguimientoRouter.get('/:nro_seguimiento', getOne);
seguimientoRouter.post('/', create);
seguimientoRouter.put('/:nro_seguimiento', update);
seguimientoRouter.delete('/:nro_seguimiento', deleteSeguimiento);