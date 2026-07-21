import { Colocacion } from "../../entities/colocacion.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { ColocacionRepository } from "../colocacion.repository.js";

export class FindAllColocacion {
    constructor(private readonly colocacionRepository: ColocacionRepository) {}

    async ejecutar(): Promise<ServiceResponse<Colocacion[]>> {
        const colocaciones = await this.colocacionRepository.findAll();
        return { success: true, status: 200, messages: ["Colocaciones obtenidas exitosamente."], data: colocaciones };
    }
}