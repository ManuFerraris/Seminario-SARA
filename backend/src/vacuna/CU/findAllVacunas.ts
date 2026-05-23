import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";

export class FindAllVacunas {
    constructor(private readonly vacunaRepository: VacunaRepository) {}
    async ejecutar(): Promise<ServiceResponse<Vacuna[]>> {
        const vacunas = await this.vacunaRepository.findAllVacunas();
        return {
            success: true,
            status: 200,
            messages: ["Vacunas obtenidas exitosamente"],
            data: vacunas
        };
    }
}
