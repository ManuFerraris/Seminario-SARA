import { Seguimiento } from "../../entities/seguimiento.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { SeguimientoRepository } from "../seg.repository.js";

export class GetOneSeguimiento {
    constructor(private readonly seguimientoRepository: SeguimientoRepository) {}
    
    async ejecutar(id_seguimiento: number): Promise<ServiceResponse<Seguimiento>> {
        const seguimiento = await this.seguimientoRepository.getOne(id_seguimiento);
        if (!seguimiento) {
            return { success: false, status: 404, messages: ["Seguimiento no encontrado."], data: undefined };
        }
        return { success: true, status: 200, messages: ["Seguimiento obtenido exitosamente."], data: seguimiento };
    }
}