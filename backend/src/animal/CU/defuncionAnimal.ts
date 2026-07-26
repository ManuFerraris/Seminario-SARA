import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

interface DTOAnimalFallecido {
    numero_animal: number;
    fecha_defuncion: Date;
    estado: string;
}

export class CambiarEstadoFallecido {
    constructor(private readonly repo:AnimalRepository){};

    async ejecutar(dto:DTOAnimalFallecido, numero:number):Promise<ServiceResponse<DTOAnimalFallecido>>{
        
        const animal = await this.repo.getOne(numero);
        if(!animal) return {
            status: 404,
            success: false,
            messages: [`El numero ingresado del animal no existe`],
            data: undefined
        };

        if(animal.estado === 'Fallecido') return {
            status: 400,
            success: false,
            messages: [`El animal ya se encuentra registrado como fallecido.`],
            data: undefined
        };
        
        const errores: string[] = [];

        if(!dto.fecha_defuncion) errores.push("El campo 'fecha_defuncion' es obligatorio");
        
        const fechaDate = new Date(dto.fecha_defuncion);
        if(fechaDate > new Date()) errores.push("El campo 'fecha_defuncion' no puede ser una fecha futura");
        if(!dto.fecha_defuncion) errores.push("El campo 'fecha_defuncion' es obligatorio");

        if(isNaN(fechaDate.getTime())) errores.push("El campo 'fecha_defuncion' no es una fecha válida");
        
        if(errores.length > 0) return {
            status: 400, 
            success: false, 
            messages: errores 
        };

        await this.repo.cambiarEstadoFallecido(animal, dto);

        const parLoadFront: DTOAnimalFallecido = {
            numero_animal: animal.nro_animal,
            fecha_defuncion: animal.fecha_defuncion!,
            estado: animal.estado
        };

        return {
            status: 200,
            success: true,
            messages: [`Animal con número ${numero} actualizado exitosamente.`],
            data: parLoadFront
        };
    };
};