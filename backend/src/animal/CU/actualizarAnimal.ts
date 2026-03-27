import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { AnimalDTO } from "../animalDTO.js";
import { validarActualizacionAnimal } from "../validarActualizacionAnimal.js";
import { ServiceResponse } from "../../types/service.response.js";

export class ActualizarAnimal {
    constructor(private readonly repo:AnimalRepository){};

    async ejecutar(dto:AnimalDTO, numero:number):Promise<ServiceResponse<Animal>>{
        
        const animal = await this.repo.getOne(numero);
        if(!animal) return {
            status: 404,
            success: false,
            messages: [`No se encontró un animal con el número ${numero}.`],
            data: undefined
        };
        
        const errores = await validarActualizacionAnimal(dto);
        if(errores.length > 0) return {
            status: 400, 
            success: false, 
            messages: errores 
        };

        const animalActualizado = await this.repo.update(animal, dto);

        return {
            status: 200,
            success: true,
            messages: [`Animal con número ${numero} actualizado exitosamente.`],
            data: animalActualizado
        };
    };
};