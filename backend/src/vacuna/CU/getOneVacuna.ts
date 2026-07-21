import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";

export class GetOneVacuna {
    constructor(private readonly vacunaRepository: VacunaRepository) {}
    
    async ejecutar(numero: number): Promise<ServiceResponse<Vacuna | null>> {
        const vacuna = await this.vacunaRepository.getOneVacuna(numero);
        
        // ¡Bug de falso positivo solucionado!
        if (!vacuna) {
            return {
                success: false,
                status: 404,
                messages: ["Vacuna no encontrada"],
                data: null
            };
        }

        return {
            success: true,
            status: 200,
            messages: ["Vacuna obtenida exitosamente"],
            data: vacuna
        };
    }
}