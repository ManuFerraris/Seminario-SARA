import { EntrevistaRepository } from "../entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class DeleteEntrevista {
    constructor(private entRepo: EntrevistaRepository) {}

    async ejecutar(id_entrevista: number): Promise<ServiceResponse<null>> {
        
        const entrevista = await this.entRepo.buscarEntrevista(id_entrevista);
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["Entrevista no encontrada"],
                data: null
            };
        }
        
        await this.entRepo.eliminarEntrevista(id_entrevista);
        
        return {
            success: true,
            status: 200,
            messages: ["Entrevista eliminada"],
            data: null
        };
    }
}