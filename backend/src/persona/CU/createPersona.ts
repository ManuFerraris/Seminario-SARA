import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionPersona } from "../validarCreacionPersona.js";

export class CreatePersona {
    constructor(private readonly repo: PersonaRepository) {}

    async ejecutar(dto: PersonaDTO): Promise<ServiceResponse<Persona>> {
        const errores = validarCreacionPersona(dto);
        if (errores.length > 0) {
            return {
                success: false,
                status: 400,
                messages: errores,
                data: undefined
            };
        }

        // Validación de unicidad de DNI (PK)
        const dniExistente = await this.repo.findOne(dto.dni);
        if (dniExistente) {
            return {
                success: false,
                status: 409, // 409 Conflict es más semántico para duplicados
                messages: ['El DNI ya está registrado'],
                data: undefined
            };
        }

        // Validación de unicidad de Email
        const emailExistente = await this.repo.findByEmail(dto.email);
        if (emailExistente) {
            return {
                success: false,
                status: 409,
                messages: ['El email ya está registrado'],
                data: undefined
            };
        }

        // Instanciación limpia utilizando MikroORM (asumiendo que repo.create hace em.create y em.persist)
        const personaCreada = await this.repo.create(dto);
        
        return {
            success: true,
            status: 201,
            messages: ['Persona creada exitosamente'],
            data: personaCreada
        };
    }
}