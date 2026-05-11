import { Router } from "express";
import {
findAll,
getOne,
create,
update,
deleteColaborador
} from "./colaborador.controller.js";

export const colaboradorRouter = Router();

colaboradorRouter.get("/", findAll);
colaboradorRouter.get("/:id", getOne);
colaboradorRouter.post("/", create);
colaboradorRouter.put("/:id", update);
colaboradorRouter.delete("/:id", deleteColaborador);