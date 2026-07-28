import { Router } from "express";
import { verificarToken } from "../login/auth.middleware.js";
import {
    findAll,
    getOne,
    create,
    update,
    deleteAnimal,
    cambiarEstadoDisponible,
    cambiarEstadoFallecido,
    getAnimalEstDisponible
} from "./animal.controller.js";

export const animalRouter = Router();

// 1. RUTAS ESTÁTICAS PRIMERO
animalRouter.get("/", verificarToken(["Colaborador", "Veterinario", "Adoptante"]), findAll);

// Si querés que sea pública sacale el verificarToken, 
// si no, dejalo para que solo Adoptantes puedan verla.
animalRouter.get("/estado-disponible", getAnimalEstDisponible);

// 2. RUTAS DINÁMICAS (con parámetros :id) DESPUÉS
animalRouter.get("/:nro_animal", verificarToken(["Colaborador", "Veterinario"]), getOne);
animalRouter.put("/:nro_animal", verificarToken(["Colaborador", "Veterinario"]), update);
animalRouter.delete("/:nro_animal", verificarToken(["Colaborador", "Veterinario"]), deleteAnimal);
animalRouter.put("/:nro_animal/cambiar-estado", verificarToken(["Colaborador", "Veterinario"]), cambiarEstadoDisponible);
animalRouter.put("/:nro_animal/cambiar-estado-fallecido", verificarToken(["Colaborador", "Veterinario"]), cambiarEstadoFallecido);

// 3. RUTAS POST 
animalRouter.post("/", /*verificarToken(["Colaborador", "Veterinario"]), */create);
