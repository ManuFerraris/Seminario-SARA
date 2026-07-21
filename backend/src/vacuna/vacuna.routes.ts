import { Router } from "express";
import {
findAllVacunas,
getOneVacunas,
createVacunas,
updateVacunas,
deleteVacunas
} from "./vacuna.controller.js";

export const vacunaRouter = Router();

vacunaRouter.get("/", findAllVacunas);
vacunaRouter.get("/:nro_vacuna", getOneVacunas);
vacunaRouter.post("/", createVacunas);
vacunaRouter.put("/:nro_vacuna", updateVacunas);
vacunaRouter.delete("/:nro_vacuna", deleteVacunas);