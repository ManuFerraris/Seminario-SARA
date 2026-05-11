import { Router } from "express";
import {
    findAllDonaciones,
    getOneDonacion,
    createDonacion,
    updateDonacion,
    deleteDonacion
} from "./donacion.controller.js";

export const donacionRouter = Router();

donacionRouter.get("/", findAllDonaciones);
donacionRouter.get("/:numero", getOneDonacion);
donacionRouter.post("/", createDonacion);
donacionRouter.put("/:numero", updateDonacion);
donacionRouter.delete("/:numero", deleteDonacion);