import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
findAllRescates,
getOneRescate,
createRescate,
updateRescate,
deleteRescate
} from "./rescate.controller.js";

export const rescateRouter = Router();

rescateRouter.get("/", verificarToken(["Colaborador", "Veterinario"]), findAllRescates);
rescateRouter.get("/:nro_rescate", verificarToken(["Colaborador", "Veterinario"]), getOneRescate);
rescateRouter.post("/", verificarToken(["Colaborador", "Veterinario"]), createRescate);
rescateRouter.put("/:nro_rescate", verificarToken(["Colaborador", "Veterinario"]), updateRescate);
rescateRouter.delete("/:nro_rescate", verificarToken(["Colaborador", "Veterinario"]), deleteRescate);