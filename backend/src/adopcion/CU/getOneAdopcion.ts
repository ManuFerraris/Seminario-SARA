import { Adopcion } from "../../entities/adopcion.entity.js";
import { ServiceResponse } from "../../types/service.response";
import { AdopcionRepository } from "../adopcion.repository.js";

export class GetOneAdopcion {
    constructor(private readonly adopcionRepository: AdopcionRepository) {}
    
    async ejecutar(numero: number): Promise<ServiceResponse<Adopcion>> {
        const adopcion = await this.adopcionRepository.getOneAdopcion(numero);
        if (!adopcion) {
            return { success: false, status: 404, messages: ["Adopción no encontrada."], data: undefined };
        }
        return { success: true, status: 200, messages: ["Adopción obtenida exitosamente."], data: adopcion };
    }
}