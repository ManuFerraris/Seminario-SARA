import { Seguimiento } from "../../entities/seguimiento.entity";
import { ServiceResponse } from "../../types/service.response";
import { SeguimientoRepository } from "../seg.repository";

export class FindAllSeguimiento {
    constructor(private readonly seguimientoRepository: SeguimientoRepository) {}

    async ejecutar(): Promise<ServiceResponse<Seguimiento[]>> {
        const seguimientos = await this.seguimientoRepository.getAll();
        return { success: true, status: 200, messages: ["Seguimientos obtenidos exitosamente."], data: seguimientos };
    }
}