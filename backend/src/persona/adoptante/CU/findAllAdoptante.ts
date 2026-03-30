import { Adoptante } from "../../../entities/adoptante.entity.js";
import { AdoptanteRepository } from "../adoptante.repositoty.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class FindAllAdoptantes {
    constructor(private repo: AdoptanteRepository) {};
    async ejecutar(): Promise<ServiceResponse<Adoptante[]>> {
        const adoptantes = await this.repo.findAll();
        return {
            status: 200,
            success: true,
            messages: ["Adoptantes encontrados"],
            data: adoptantes
        };
    }
}