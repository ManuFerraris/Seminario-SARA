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

entrevistaRouter.get("/:id_entrevista", getOneEntrevista);
entrevistaRouter.get("/", findAllEntrevistas);
entrevistaRouter.post("/", createEntrevista);
entrevistaRouter.put("/:id_entrevista", updateEntrevista);
//entrevistaRouter.delete("/:id_entrevista", deleteEntrevista);
entrevistaRouter.delete("/:id_entrevista", bajaLogicaEntrevista);