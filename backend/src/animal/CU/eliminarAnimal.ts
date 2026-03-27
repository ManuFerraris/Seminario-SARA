import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class EliminarAnimal {
    constructor(private readonly repo:AnimalRepository){};
    async ejecutar(numero:number):Promise<ServiceResponse<void>>{
        const animal = await this.repo.getOne(numero);
        if(!animal) return {
            status: 404,
            success: false,
            messages: [`No se encontró un animal con el número ${numero}.`],
            data: undefined
        };
        await this.repo.delete(numero);
        return {
            status: 200,
            success: true,
            messages: [`Animal con número ${numero} eliminado exitosamente.`],
            data: undefined
        };
    };
};