import { Router } from "express";
import {
    findAll,
    getOne,
    create,
    update,
    deleteVeterinario
} from "./veterinario.controller.js";

export const veterinarioRouter = Router();

veterinarioRouter.get("/", findAll);
veterinarioRouter.get("/:numero_persona", getOne);
veterinarioRouter.post("/", create);
veterinarioRouter.put("/:numero_persona", update);
veterinarioRouter.delete("/:numero_persona", deleteVeterinario);