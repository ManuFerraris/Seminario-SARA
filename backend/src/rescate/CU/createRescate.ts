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

        const fechaRescate = new Date(dto.fecha_hora);

        // 2. VALIDACIONES ASÍNCRONAS (Base de Datos)
        const persona = await this.personaRepository.findOne(dto.numero_persona);
        if (!persona) {
            return {
                success: false,
                status: 404,
                messages: ["Persona no encontrada"],
                data: undefined,
            };
        }

        const animal = await this.animalRepository.getOne(dto.numero_animal);
        if (!animal) {
            return {
                success: false,
                status: 404,
                messages: ["Animal no encontrado"],
                data: undefined,
            };
        }

        const rescateExistente = await this.rescateRepository.getOneRescate(dto.numero_persona, dto.numero_animal, fechaRescate);
        if (rescateExistente) {
            return {
                success: false,
                status: 409,
                messages: ["El rescate ya se encuentra registrado"],
                data: undefined
            };
        }

        // 3. CREACIÓN Y PERSISTENCIA
        const nuevoRescate = new Rescate();
        nuevoRescate.persona = persona;
        nuevoRescate.animal = animal;
        nuevoRescate.fecha_hora = fechaRescate;
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