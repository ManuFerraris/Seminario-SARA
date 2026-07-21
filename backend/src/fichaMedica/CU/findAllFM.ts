import { FichaMedica } from "../../entities/ficha-medica.entity.js";
import { FichaMedicaRepository } from "../fichaMedica.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class FindAllFichaMedica {
    constructor(private readonly fichaMedicaRepository: FichaMedicaRepository) {}

    async ejecutar(): Promise<ServiceResponse<FichaMedica[]>> {
        const fichas = await this.fichaMedicaRepository.findAll();
        return { success: true, status: 200, messages: ["Fichas médicas obtenidas exitosamente."], data: fichas };
    }
}