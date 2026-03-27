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
animalRouter.get("/:numero", getOne);
animalRouter.post("/", create);
animalRouter.put("/:numero", update);
animalRouter.delete("/:numero", deleteAnimal);