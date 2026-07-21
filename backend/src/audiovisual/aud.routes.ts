import { Router } from "express";
import {
    createAudiovisual,
    uploadMiddleware,
    deleteAudiovisual
} from "./aud.controller.js";

export const audiovisualRouter = Router();

// Ruta para crear un nuevo audiovisual (con subida de archivo)
audiovisualRouter.post("/", uploadMiddleware, createAudiovisual);
audiovisualRouter.delete("/:id_audiovisual", deleteAudiovisual);