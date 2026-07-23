import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import { 
findAll,
getOne,
create,
update,
deleteSeguimiento 
} from "./seguimiento.controller.js";
export const seguimientoRouter = Router();

seguimientoRouter.get('/', verificarToken(["Colaborador", "Veterinario"]), findAll);
seguimientoRouter.get('/:nro_seguimiento', verificarToken(["Colaborador", "Veterinario"]), getOne);
seguimientoRouter.post('/', verificarToken(["Colaborador", "Veterinario"]), create);
seguimientoRouter.put('/:nro_seguimiento', verificarToken(["Colaborador", "Veterinario"]), update);
seguimientoRouter.delete('/:nro_seguimiento', verificarToken(["Colaborador", "Veterinario"]), deleteSeguimiento);