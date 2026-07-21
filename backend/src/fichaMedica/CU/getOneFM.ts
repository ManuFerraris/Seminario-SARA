import { FichaMedica } from "../../entities/ficha-medica.entity.js";
import { FichaMedicaRepository } from "../fichaMedica.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class GetOneFichaMedica {
    constructor(private readonly fichaMedicaRepository: FichaMedicaRepository) {}
    
    async ejecutar(numero: number): Promise<ServiceResponse<FichaMedica>> {
        const ficha = await this.fichaMedicaRepository.getOneFichaMedica(numero);
        if (!ficha) {
            return { success: false, status: 404, messages: ["Ficha médica no encontrada."], data: undefined };
        }
        return { success: true, status: 200, messages: ["Ficha médica obtenida exitosamente."], data: ficha };
    }
}