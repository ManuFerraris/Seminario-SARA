import { Colocacion } from "../../entities/colocacion.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { ColocacionRepository } from "../colocacion.repository.js";

export class GetOneColocacion {
    constructor(private readonly colocacionRepository: ColocacionRepository) {}
    
    async ejecutar(numero: number): Promise<ServiceResponse<Colocacion>> {
        const colocacion = await this.colocacionRepository.getOneColocacion(numero);
        if (!colocacion) {
            return { success: false, status: 404, messages: ["Colocación no encontrada."], data: undefined };
        }
        return { success: true, status: 200, messages: ["Colocación obtenida exitosamente."], data: colocacion };
    }
}