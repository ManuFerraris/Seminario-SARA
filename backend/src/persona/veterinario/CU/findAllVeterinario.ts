import { Veterinario } from "../../../entities/veterinario.entity.js";
import { VeterinarioRepository } from "../veterinario.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class FindAllVeterinario {
    constructor(private veterinarioRepo: VeterinarioRepository) {};

    async ejecutar(): Promise<ServiceResponse<Veterinario[]>> {
        const veterinarios = await this.veterinarioRepo.findAll();
        return {
            status: 200,
            success: true,
            messages: ["Veterinarios encontrados"],
            data: veterinarios
        };
    }
};