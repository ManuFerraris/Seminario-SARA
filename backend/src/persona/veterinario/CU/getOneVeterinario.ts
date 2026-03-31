import { Veterinario } from "../../../entities/veterinario.entity.js";
import { VeterinarioRepository } from "../veterinario.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class GetOneVeterinario {
    constructor(private veterinarioRepo: VeterinarioRepository) {}
    async ejecutar(numero_persona: number): Promise<ServiceResponse<Veterinario>> {
        
        const veterinario = await this.veterinarioRepo.findOne(numero_persona);
        if (!veterinario) {
            return {
                status: 404,
                success: false,
                messages: ["Veterinario no encontrado"],
                data: undefined
            };
        };

        return {
            status: 200,
            success: true,
            messages: ["Veterinario encontrado"],
            data: veterinario
        };
    };
};