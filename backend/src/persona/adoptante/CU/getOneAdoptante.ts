import { Adoptante } from "../../../entities/adoptante.entity.js";
import { AdoptanteRepository } from "../adoptante.repositoty.js";
import { PersonaRepository } from "../../persona.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";


export class GetOneAdoptantes {
    constructor(private adoptanteRepo: AdoptanteRepository) {};
    async ejecutar (numero_persona: number): Promise<ServiceResponse<Adoptante>> {

        const adoptante = await this.adoptanteRepo.findOne(numero_persona);
        if (!adoptante) {
            return {
                status: 404,
                success: false,
                messages: ["Adoptante no encontrado"],
                data: undefined
            };
        };
        
        return {
            status: 200,
            success: true,
            messages: ["Adoptante encontrado"],
            data: adoptante
        };
    };
};