import { Rescate } from "../../entities/rescate.entity.js";
import { RescateDTO } from "../rescateDTO.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";

export class UpdateRescate {
    constructor(
        private rescateRepository: RescateRepository,
        private animalRepository: AnimalRepository,
        private personaRepository: PersonaRepository
    ) {}

    async ejecutar(numero_persona: number, numero_animal: number, fecha_hora: Date, dto: Partial<RescateDTO>): Promise<ServiceResponse<Rescate>> {
        // 1. VALIDACIÓN SÍNCRONA
        if(dto.lugar_rescate !== undefined && (dto.lugar_rescate.trim().length === 0 || dto.lugar_rescate.length > 255)) {
            return {
                success: false,
                status: 400,
                messages: ["El lugar del rescate debe tener entre 1 y 255 caracteres"],
                data: undefined
            };
        };

        // 2. VALIDACIONES ASÍNCRONAS (Base de Datos)
        const persona = await this.personaRepository.findOne(numero_persona);
        if (!persona) {
            return {
                success: false,
                status: 404,
                messages: ["Persona no encontrada"],
                data: undefined,
            };
        };

        const animal = await this.animalRepository.getOne(numero_animal);
        if (!animal) {
            return {
                success: false,
                status: 404,
                messages: ["Animal no encontrado"],
                data: undefined,
            };
        };

        const rescateExistente = await this.rescateRepository.getOneRescate(numero_persona, numero_animal, fecha_hora);
        if (!rescateExistente) {
            return {
                success: false,
                status: 404,
                messages: ["Rescate no encontrado para actualizar"],
                data: undefined
            };
        };

        // 3. ACTUALIZACIÓN Y PERSISTENCIA
        if(dto.lugar_rescate !== undefined) rescateExistente.lugar_rescate = dto.lugar_rescate;
        await this.rescateRepository.updateRescate(rescateExistente);
        return {
            success: true,
            status: 200,
            messages: ["Rescate actualizado correctamente"],
            data: rescateExistente
        };
    }
}
