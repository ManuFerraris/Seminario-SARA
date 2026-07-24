import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class CambiarEstadoDisponible {
    constructor(private repo:AnimalRepository){};
    async ejecutar(codAnimal:number):Promise<ServiceResponse<Partial<Animal>>>{
        const animal = await this.repo.getOne(codAnimal);
        if(!animal){
            return {
                status: 404,
                success: false,
                messages: ["No se encontró el animal con el código proporcionado"],
                data: undefined
            };
        };

        await this.repo.cambiarEstadoDisponible(animal);

        const datosNecesarios = {
            nro_animal: animal.nro_animal,
            estado: animal.estado
        };

        return {
            status: 200,
            success: true,
            messages: ["Estado del animal actualizado correctamente"],
            data: datosNecesarios
        };
    }
}