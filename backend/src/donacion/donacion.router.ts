import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
    findAllDonaciones,
    getOneDonacion,
    createDonacion,
    updateDonacion,
    deleteDonacion
} from "./donacion.controller.js";


export const donacionRouter = Router();

donacionRouter.get("/", verificarToken(["Colaborador", "Veterinario"]), findAllDonaciones);
donacionRouter.get("/:numero", verificarToken(["Colaborador", "Veterinario"]), getOneDonacion);
donacionRouter.post("/", verificarToken(["Colaborador", "Veterinario"]), createDonacion);
donacionRouter.put("/:numero", verificarToken(["Colaborador", "Veterinario"]), updateDonacion);
donacionRouter.delete("/:numero", verificarToken(["Colaborador", "Veterinario"]), deleteDonacion);