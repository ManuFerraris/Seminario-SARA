import { Router } from "express";
import {
getOneEntrevista,
findAllEntrevistas,
createEntrevista,
updateEntrevista,
deleteEntrevista,
bajaLogicaEntrevista
} from "./entrevista.controller.js";

export const entrevistaRouter = Router();

entrevistaRouter.get("/:numero_adoptante/:id_colaborador/:fecha_hora", getOneEntrevista);
entrevistaRouter.get("/", findAllEntrevistas);
entrevistaRouter.post("/", createEntrevista);
entrevistaRouter.put("/:numero_adoptante/:id_colaborador/:fecha_hora", updateEntrevista);
//entrevistaRouter.delete("/:numero_adoptante/:id_colaborador/:fecha_hora", deleteEntrevista);
entrevistaRouter.delete("/:numero_adoptante/:id_colaborador/:fecha_hora", bajaLogicaEntrevista);