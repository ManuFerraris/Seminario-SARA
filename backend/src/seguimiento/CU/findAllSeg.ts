import { Seguimiento } from "../../entities/seguimiento.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { SeguimientoRepository } from "../seg.repository.js";

export class FindAllSeguimiento {
    constructor(private readonly seguimientoRepository: SeguimientoRepository) {}

    async ejecutar(): Promise<ServiceResponse<Seguimiento[]>> {
        const seguimientos = await this.seguimientoRepository.getAll();
        return { success: true, status: 200, messages: ["Seguimientos obtenidos exitosamente."], data: seguimientos };
    }
}