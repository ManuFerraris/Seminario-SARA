import { Rescate } from "../../entities/rescate.entity.js";
import { Animal } from "../../entities/animal.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { validarCreacionAnimal } from "../../animal/validarCreacionAnimal.js";

interface CURegistrarRescate {
    dni_rescatista: string;
    animal_especie: string;
    animal_sexo: "Macho" | "Hembra";
    animal_raza: string;
    animal_peso: number;
    animal_estado: 'No Apto';
    animal_edad_estimada: number;
    animal_descripcion?: string;
    lugar_rescate_descripcion: string;
    fecha_rescate: Date | string;
    fecha_ingreso_animal: Date;
    fotos?: string[];
}

export class RegistrarRescate {
    constructor(
        private rescateRepository: RescateRepository,
        private animalRepository: AnimalRepository,
        private personaRepository: PersonaRepository
    ) {}

    async ejecutar(dto: CURegistrarRescate): Promise<ServiceResponse<Rescate>> {
        
        // 1. VALIDACIÓN SÍNCRONA
        if (!dto.lugar_rescate_descripcion || dto.lugar_rescate_descripcion.trim().length === 0 || dto.lugar_rescate_descripcion.length > 255) {
            return {
                success: false,
                status: 400,
                messages: ["El lugar de rescate es obligatorio y debe tener entre 1 y 255 caracteres"],
                data: undefined
            };
        }

        const fechaRescate = new Date(dto.fecha_rescate); // Asegúrate de que el DTO envíe fecha_rescate

        // 2. VALIDACIONES ASÍNCRONAS (Base de Datos)
        
        // OJO AQUÍ: Ahora buscamos por DNI (string), no por número
        const persona = await this.personaRepository.findOne(dto.dni_rescatista);
        if (!persona) {
            return {
                success: false,
                status: 404,
                messages: ["Persona rescatista no encontrada con el DNI provisto"],
                data: undefined,
            };
        }

        interface AnimalDTOCU {
            especie: string;
            sexo: "Macho" | "Hembra";
            raza: string;
            peso: number;
            estado: 'No Apto';
            edad_estimada: number;
            descripcion?: string;
            fecha_ingreso: Date;
            nro_animal: 0, // Se autogenera, no es necesario enviarlo
        }
        const animalDTO: AnimalDTOCU = {
            nro_animal: 0, // Se autogenera, no es necesario enviarlo
            especie: dto.animal_especie,
            sexo: dto.animal_sexo,
            raza: dto.animal_raza,
            peso: dto.animal_peso,
            estado: dto.animal_estado,
            edad_estimada: dto.animal_edad_estimada,
            descripcion: dto.animal_descripcion,
            fecha_ingreso: dto.fecha_ingreso_animal
        };
        const errores = await validarCreacionAnimal(animalDTO);
        if(errores.length > 0){
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };

        const animalNuevo = new Animal();
        animalNuevo.especie = dto.animal_especie;
        animalNuevo.sexo = dto.animal_sexo;
        animalNuevo.raza = dto.animal_raza;
        animalNuevo.peso = dto.animal_peso;
        animalNuevo.estado = dto.animal_estado;
        animalNuevo.edad_estimada = dto.animal_edad_estimada;
        animalNuevo.descripcion = dto.animal_descripcion;
        animalNuevo.fecha_ingreso = new Date(dto.fecha_ingreso_animal);

        const animal = await this.animalRepository.create(animalNuevo);
        
        console.log("Animal creado con éxito:", animal);

        const rescateExistente = await this.rescateRepository.buscarRescatePorRelaciones(persona, animal, fechaRescate);
        if (rescateExistente) {
            return {
                success: false,
                status: 409, // 409 Conflict
                messages: ["El rescate ya se encuentra registrado para esta persona y animal en esa fecha"],
                data: undefined
            };
        }

        // 3. CREACIÓN Y PERSISTENCIA
        const nuevoRescate = new Rescate();
        nuevoRescate.persona = persona;
        nuevoRescate.animal = animal;
        nuevoRescate.fecha_rescate = fechaRescate;
        nuevoRescate.lugar_rescate = dto.lugar_rescate_descripcion.trim();
        
        await this.rescateRepository.createRescate(nuevoRescate);
        
        return {
            success: true,
            status: 201,
            messages: ["Rescate creado exitosamente"],
            data: nuevoRescate
        };
    }
}