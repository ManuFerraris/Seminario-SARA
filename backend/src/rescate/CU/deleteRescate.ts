import { RescateRepository } from "../rescate.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class DeleteRescate {
    constructor(private readonly rescateRepository: RescateRepository) {}
    async ejecutar(id: number): Promise<ServiceResponse<null>> {
        // 1. Búsqueda
        const rescate = await this.rescateRepository.getOneRescate(id);
        if (!rescate) {
            return {
                success: false,
                status: 404,
                messages: ["Rescate no encontrado"],
                data: undefined
            };
        }
        // 2. Eliminación
        await this.rescateRepository.deleteRescate(rescate);
        return {
            success: true,
            status: 200,
            messages: ["Rescate eliminado correctamente"],
            data: null
        };
    }
}