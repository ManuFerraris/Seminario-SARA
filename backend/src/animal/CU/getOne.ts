import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class GetOne {
    constructor(private readonly repo:AnimalRepository){};
    async ejecutar(numero:number):Promise<ServiceResponse<Animal>>{
        const animal = await this.repo.getOne(numero);
        if(animal){
            return{
                success: true,
                status: 200,
                messages: ['Animal encontrado'],
                data: animal
            }
        } else {
            return {
                success: false,
                status: 400,
                messages: ['Animal no encontrado'],
                data: animal
            }
        };
    };
};