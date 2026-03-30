import { Router } from "express";
import { 
    findAll,
    findOne,
    create,
    update,
    deleteAdoptante
} from "./adoptante.controller.js";

export const adoptanteRouter = Router();

adoptanteRouter.get("/", findAll);
adoptanteRouter.get("/:numero_persona", findOne);
adoptanteRouter.post("/", create);
adoptanteRouter.put("/:numero_persona", update);
adoptanteRouter.delete("/:numero_persona", deleteAdoptante);