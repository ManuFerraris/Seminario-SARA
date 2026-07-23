import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
getOneEntrevista,
findAllEntrevistas,
createEntrevista,
updateEntrevista,
deleteEntrevista,
bajaLogicaEntrevista
} from "./entrevista.controller.js";

export const entrevistaRouter = Router();

entrevistaRouter.get("/:id_entrevista", verificarToken(["Colaborador", "Veterinario"]), getOneEntrevista);
entrevistaRouter.get("/", verificarToken(["Colaborador", "Veterinario"]), findAllEntrevistas);
entrevistaRouter.post("/", verificarToken(["Colaborador", "Veterinario"]), createEntrevista);
entrevistaRouter.put("/:id_entrevista", verificarToken(["Colaborador", "Veterinario"]), updateEntrevista);
//entrevistaRouter.delete("/:id_entrevista", verificarToken(["Colaborador", "Veterinario"]), deleteEntrevista);
entrevistaRouter.delete("/:id_entrevista", bajaLogicaEntrevista);