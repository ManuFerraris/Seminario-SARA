import { Router } from "express";
import {
findAllRescates,
getOneRescate,
createRescate,
updateRescate
} from "./rescate.controller.js";

export const rescateRouter = Router();

rescateRouter.get("/", findAllRescates);
rescateRouter.get("/:numero_p/:numero_a/:fecha_hora", getOneRescate);
rescateRouter.post("/", createRescate);
rescateRouter.put("/:numero_p/:numero_a/:fecha_hora", updateRescate);