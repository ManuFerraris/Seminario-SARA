import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class GetOneEntrevista {
    // Solo necesitamos el repositorio de Entrevista
    constructor(private entRepo: EntrevistaRepository) {}

    async ejecutar(id_entrevista: number): Promise<ServiceResponse<Entrevista>> {
        // La búsqueda ahora es directa y ultra rápida por la PK
        const entrevista = await this.entRepo.buscarEntrevista(id_entrevista);
        
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["Entrevista no encontrada"],
                data: undefined
            };
        }
        
        return {
            success: true,
            status: 200,
            messages: ["Entrevista encontrada"],
            data: entrevista
        };
    }
}