import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
    findAll,
    getOne,
    create,
    update,
    deleteAnimal,
    cambiarEstadoDisponible
} from "./animal.controller.js";

export const animalRouter = Router();

animalRouter.get("/", verificarToken(["Colaborador", "Veterinario", "Adoptante"]), findAll);
animalRouter.get("/:nro_animal", verificarToken(["Colaborador", "Veterinario"]), getOne);
animalRouter.post("/", verificarToken(["Colaborador", "Veterinario"]), create);
animalRouter.put("/:nro_animal", verificarToken(["Colaborador", "Veterinario"]), update);
animalRouter.delete("/:nro_animal", verificarToken(["Colaborador", "Veterinario"]), deleteAnimal);
animalRouter.put("/:nro_animal/cambiar-estado", verificarToken(["Colaborador", "Veterinario"]), cambiarEstadoDisponible);