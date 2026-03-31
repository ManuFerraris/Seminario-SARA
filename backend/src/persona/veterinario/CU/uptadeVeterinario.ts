import { Veterinario } from "../../../entities/veterinario.entity.js";
import { VeterinarioRepository } from "../veterinario.repository.js";
import { PersonaRepository } from "../../persona.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";
import { validarActualizacionVeterinario } from "../validarActualizacionVeterinario.js";
import { VeterinarioDTO } from "../veterinarioDTO.js";


export class UpdateVeterinario {
    constructor(
        private veterinarioRepo: VeterinarioRepository,
        private personaRepo: PersonaRepository) {}

    async ejecutar(numero_persona: number, dto: VeterinarioDTO): Promise<ServiceResponse<Veterinario>> {
        const persona = await this.personaRepo.findOne(numero_persona);
        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada"],
                data: undefined
            };
        };
        
        const veterinario = await this.veterinarioRepo.findOne(numero_persona);
        if (!veterinario) {
            return {
                status: 404,
                success: false,
                messages: ["Veterinario no encontrado"],
                data: undefined
            };
        };

        const errores = validarActualizacionVeterinario(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };
        
        const veterinarioActualizado = await this.veterinarioRepo.update(veterinario, dto);
        return {
            status: 200,
            success: true,
            messages: ["Veterinario actualizado correctamente"],
            data: veterinarioActualizado
        };
    };
};