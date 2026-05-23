import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";

export class DeleteVacunas {
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
        await this.vacunaRepository.deleteVacuna(vacuna);
        return {
            success: true,
            status: 200,
            messages: ["Vacuna eliminada exitosamente"],
            data: null,
        };
    }
}