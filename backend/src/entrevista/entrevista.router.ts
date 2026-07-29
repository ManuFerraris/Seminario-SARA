import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
getOneEntrevista,
findAllEntrevistas,
createEntrevista,
updateEntrevista,
bajaLogicaEntrevista,
registrarEntrevista,
registrarResultadoEntrevista,
reprogramarEntrevista
} from "./entrevista.controller.js";

export const entrevistaRouter = Router();

entrevistaRouter.post("/registrar", registrarEntrevista);
entrevistaRouter.get("/:id_entrevista", verificarToken(["Colaborador", "Veterinario"]), getOneEntrevista);
entrevistaRouter.get("/", verificarToken(["Colaborador", "Veterinario"]), findAllEntrevistas);
entrevistaRouter.post("/", verificarToken(["Colaborador", "Veterinario"]), createEntrevista);
entrevistaRouter.put("/:id_entrevista", verificarToken(["Colaborador", "Veterinario"]), updateEntrevista);
//entrevistaRouter.delete("/:id_entrevista", verificarToken(["Colaborador", "Veterinario"]), deleteEntrevista);
entrevistaRouter.delete("/:id_entrevista", bajaLogicaEntrevista);
entrevistaRouter.post("/:id_entrevista/resultado", verificarToken(["Colaborador", "Veterinario"]), registrarResultadoEntrevista);
entrevistaRouter.put("/:id_entrevista/reprogramar", verificarToken(["Colaborador", "Veterinario"]), reprogramarEntrevista);