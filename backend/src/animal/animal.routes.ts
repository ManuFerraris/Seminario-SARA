import { Router } from "express";
import {
    findAll,
    getOne,
    create,
    update,
    deleteAnimal
} from "./animal.controller.js";

export const animalRouter = Router();

animalRouter.get("/", findAll);
animalRouter.get("/:nro_animal", getOne);
animalRouter.post("/", create);
animalRouter.put("/:nro_animal", update);
animalRouter.delete("/:nro_animal", deleteAnimal);