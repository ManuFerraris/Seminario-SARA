import { Animal } from "../../entities/animal.entity.js";
import { AnimalDTO } from "../animalDTO.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionAnimal } from "../validarCreacionAnimal.js";

export class CrearAnimal {
    constructor(private repo:AnimalRepository){};
    async ejecutar(dto:AnimalDTO):Promise<ServiceResponse<Animal>>{
        const errores = await validarCreacionAnimal(dto);
        if(errores.length > 0){
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };

        const nuevoAnimal = new Animal();
        nuevoAnimal.especie = dto.especie;
        nuevoAnimal.raza = dto.raza;
        nuevoAnimal.edad_estimada = dto.edad_estimada;
        nuevoAnimal.fecha_ingreso = dto.fecha_ingreso;
        nuevoAnimal.fecha_defuncion = dto.fecha_defuncion;
        nuevoAnimal.estado = dto.estado;
        nuevoAnimal.sexo = dto.sexo;
        nuevoAnimal.peso = dto.peso;
        nuevoAnimal.descripcion = dto.descripcion;

        const animalCreado = await this.repo.create(nuevoAnimal);
        return {
            status: 201,
            success: true,
            messages: ["Animal creado exitosamente"],
            data: animalCreado
        };
    };
}