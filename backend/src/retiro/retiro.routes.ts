import { Router } from "express";
import { registrarRetiroMulter } from "./retiroController.js";
import { uploadEvidencias } from "../shared/multer.service.js";

export const retiroRouter = Router();

retiroRouter.post('/registrar', uploadEvidencias.array('archivos'), registrarRetiroMulter);