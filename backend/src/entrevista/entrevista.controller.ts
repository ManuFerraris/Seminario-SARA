import { Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { EntrevistaRepositoryORM } from "./entrevista.repositoryORM.js";
import { GetOneEntrevista } from "./CU/getOneEntrevista.js";
import { FindAllEntrevistas } from "./CU/findAllEntrevistas.js";
import { DeleteEntrevista } from "./CU/deleteEntrevista.js";
import { CreateEntrevista } from "./CU/createEntrevista.js";
import { UpdateEntrevista } from "./CU/updateEntrevista.js";

export const getOneEntrevista = async (req: Request, res: Response) => {
    console.log("getOneEntrevista");
};

export const findAllEntrevistas = async (req: Request, res: Response) => {
    console.log("findAllEntrevistas");
};

export const createEntrevista = async (req: Request, res: Response) => {
    console.log("createEntrevista");
};

export const updateEntrevista = async (req: Request, res: Response) => {
    console.log("updateEntrevista");
};

export const deleteEntrevista = async (req: Request, res: Response) => {
    console.log("deleteEntrevista");
};