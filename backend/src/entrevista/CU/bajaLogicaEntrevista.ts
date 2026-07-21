import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class BajaLogicaEntrevista {
    constructor(private entRepo: EntrevistaRepository) {}

    async ejecutar(id_entrevista: number): Promise<ServiceResponse<Entrevista>> {
        
        const entrevista = await this.entRepo.buscarEntrevista(id_entrevista);
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["No se encontró la entrevista solicitada para dar de baja."],
                data: undefined
            };
        }

        entrevista.estado = "Cancelada"; 

        const entrevistaCancelada = await this.entRepo.actualizarEntrevista(entrevista);

        return {
            success: true,
            status: 200,
            messages: ["Entrevista dada de baja (cancelada) exitosamente."],
            data: entrevistaCancelada
        };
    }
}