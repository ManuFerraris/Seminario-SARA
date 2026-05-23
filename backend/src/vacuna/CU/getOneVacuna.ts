import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";

export class GetOneVacunas {
    constructor(private readonly vacunaRepository: VacunaRepository) {}
    async ejecutar(numero: number): Promise<ServiceResponse<Vacuna | null>> {
        const vacunas = await this.vacunaRepository.getOneVacuna(numero);
        return {
            success: true,
            status: 200,
            messages: ["Vacunas obtenidas exitosamente"],
            data: vacunas
        };
    }
}