import { Rescate } from "../../entities/rescate.entity.js";
import { RescateDTO } from "../rescateDTO.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";

export class CreateRescate {
    constructor(
        private rescateRepository: RescateRepository,
        private animalRepository: AnimalRepository,
        private personaRepository: PersonaRepository
    ) {}

    async ejecutar(dto: RescateDTO): Promise<ServiceResponse<Rescate>> {
        
        // 1. VALIDACIÓN SÍNCRONA
        if (!dto.lugar_rescate || dto.lugar_rescate.trim().length === 0 || dto.lugar_rescate.length > 255) {
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
        const persona = await this.personaRepository.findOne(dto.dni_persona);
        if (!persona) {
            return {
                success: false,
                status: 404,
                messages: ["Persona rescatista no encontrada con el DNI provisto"],
                data: undefined,
            };
        }

        const animal = await this.animalRepository.getOne(dto.nro_animal);
        if (!animal) {
            return {
                success: false,
                status: 404,
                messages: ["Animal no encontrado"],
                data: undefined,
            };
        }

        // Validación de duplicados (opcional, pero buena práctica si el negocio lo exige)
        // Ojo: tu repositorio deberá tener un método que busque por (persona, animal, fecha)
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
        nuevoRescate.lugar_rescate = dto.lugar_rescate.trim();
        
        await this.rescateRepository.createRescate(nuevoRescate);
        
        return {
            success: true,
            status: 201,
            messages: ["Rescate creado exitosamente"],
            data: nuevoRescate
        };
    }
}