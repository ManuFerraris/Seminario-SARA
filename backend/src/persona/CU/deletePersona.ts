import { Persona } from "../../entities/persona.entity.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class DeletePersona {
    constructor(private repo: PersonaRepository){};

    async ejecutar(numero: number): Promise<ServiceResponse<null>> {
        const persona = await this.repo.findOne(numero);

        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada"],
                data: null
            };
        };
        await this.repo.delete(numero);

        return {
            status: 200,
            success: true,
            messages: ["Persona eliminada exitosamente"],
            data: null
        };
    };
};