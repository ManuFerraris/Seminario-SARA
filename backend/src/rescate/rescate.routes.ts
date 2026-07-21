import { Router } from "express";
import {
findAllRescates,
getOneRescate,
createRescate,
updateRescate
} from "./rescate.controller.js";

export const rescateRouter = Router();

rescateRouter.get("/", findAllRescates);
rescateRouter.get("/:nro_rescate", getOneRescate);
rescateRouter.post("/", createRescate);
rescateRouter.put("/:nro_rescate", updateRescate);