import { ServiceResponse } from "../../types/service.response.js";
import { SeguimientoRepository } from "../seg.repository.js";

export class DeleteSeguimiento {
    constructor(private readonly seguimientoRepository: SeguimientoRepository) {}

    async ejecutar(id: number): Promise<ServiceResponse<void>> {
        const seguimiento = await this.seguimientoRepository.getOne(id);
        if (!seguimiento) {
            return { status: 404, success: false, messages: ["Seguimiento no encontrado para eliminar."], data: undefined };
        }

        await this.seguimientoRepository.deleteSeguimiento(seguimiento);
        return { status: 200, success: true, messages: ["Seguimiento eliminado exitosamente."], data: undefined };
    }
}