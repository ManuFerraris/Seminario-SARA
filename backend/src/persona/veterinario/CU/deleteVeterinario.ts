import { Veterinario } from "../../../entities/veterinario.entity.js";
import { VeterinarioRepository } from "../veterinario.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class DeleteVeterinario {
    constructor(private veterinarioRepo: VeterinarioRepository) {};

    async ejecutar(numero_persona: number): Promise<ServiceResponse<void>> {
        const veterinario = await this.veterinarioRepo.findOne(numero_persona);
        if (!veterinario) {
            return {
                status: 404,
                success: false,
                messages: ["Veterinario no encontrado"],
                data: undefined
            };
        };
        await this.veterinarioRepo.delete(numero_persona);
        return {
            status: 200,
            success: true,
            messages: ["Veterinario eliminado correctamente"],
            data: undefined
        };
    };
};