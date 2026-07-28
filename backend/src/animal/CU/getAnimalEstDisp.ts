import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class GetAnimalEstDisponible{
    constructor(private readonly repo:AnimalRepository){};

    async ejecutar():Promise<ServiceResponse<Animal[]>>{
        const animales = await this.repo.findAll();
        const animalesDisponibles = animales.filter(animal => animal.estado === 'Disponible');

        return {
            success: true,
            status: 200,
            messages: ['Animales encontrados'],
            data: animalesDisponibles
        };
    };
};