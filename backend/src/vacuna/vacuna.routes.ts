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
vacunaRouter.get("/:numero", getOneVacunas);
vacunaRouter.post("/", createVacunas);
vacunaRouter.put("/:numero", updateVacunas);
vacunaRouter.delete("/:numero", deleteVacunas);