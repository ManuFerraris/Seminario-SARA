import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarActualizacionPersona } from "../validarActualizacionPersona.js";

export class UpdatePersona {
    constructor(private readonly repo: PersonaRepository) {}

    async ejecutar(dni: string, dto: Partial<PersonaDTO>): Promise<ServiceResponse<Persona>> {
        
        // 1. Validar sintaxis
        const errores = validarActualizacionPersona(dto);
        if (errores.length > 0) {
            return {
                success: false,
                status: 400,
                messages: errores,
                data: undefined
            };
        }

        // 2. Buscar la entidad existente por DNI
        const persona = await this.repo.findOne(dni);
        if (!persona) {
            return {
                success: false,
                status: 404,
                messages: ['Persona no encontrada'],
                data: undefined
            };
        }

        // 3. Validar unicidad de Email (solo si lo están queriendo cambiar)
        if (dto.email && dto.email !== persona.email) {
            const emailExistente = await this.repo.findByEmail(dto.email);
            if (emailExistente) {
                return {
                    success: false,
                    status: 409,
                    messages: ['El email ya está registrado por otro usuario'],
                    data: undefined
                };
            }
        }

        // 4. Bloqueo de seguridad: Evitar que modifiquen la PK accidentalmente enviándola en el DTO
        if (dto.dni && dto.dni !== persona.dni) {
             return {
                 success: false,
                 status: 400,
                 messages: ['No está permitido modificar el DNI de una persona registrada.'],
                 data: undefined
             };
        }

        // 5. Persistencia
        const personaActualizada = await this.repo.update(persona, dto);
        
        return {
            success: true,
            status: 200,
            messages: ['Persona actualizada exitosamente'],
            data: personaActualizada
        };
    }
}