import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";

export class DeleteVacuna {
    constructor(private readonly vacunaRepository: VacunaRepository) {}
    
    async ejecutar(numero: number): Promise<ServiceResponse<null>> {
        const vacuna = await this.vacunaRepository.getOneVacuna(numero);
        if (!vacuna) {
            return {
                success: false,
                status: 404,
                messages: ["Vacuna no encontrada"],
                data: null,
            };
        }
        await this.vacunaRepository.deleteVacuna(vacuna); // O this.vacunaRepository.deleteVacuna(numero) según tu implementación
        return {
            success: true,
            status: 200,
            messages: ["Vacuna eliminada exitosamente"],
            data: null,
        };
    }
}