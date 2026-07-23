import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
    createAudiovisual,
    uploadMiddleware,
    deleteAudiovisual
} from "./aud.controller.js";

export const audiovisualRouter = Router();

// Ruta para crear un nuevo audiovisual (con subida de archivo)
audiovisualRouter.post("/", verificarToken(["Colaborador", "Veterinario"]), uploadMiddleware, createAudiovisual);
audiovisualRouter.delete("/:id_audiovisual", verificarToken(["Colaborador", "Veterinario"]), deleteAudiovisual);