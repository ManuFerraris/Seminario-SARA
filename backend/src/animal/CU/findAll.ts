import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class FindAll{
    constructor(private readonly repo:AnimalRepository){};

    async ejecutar():Promise<ServiceResponse<Animal[]>>{
        const animales = await this.repo.findAll();
        return {
            success: true,
            status: 200,
            messages: ['Animales encontrados'],
            data: animales
        };
    };
};