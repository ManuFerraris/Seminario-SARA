import { Adopcion } from "../../entities/adopcion.entity.js";
import { ServiceResponse } from "../../types/service.response";
import { AdopcionRepository } from "../adopcion.repository.js";

export class FindAllAdopcion {
    constructor(private readonly adopcionRepository: AdopcionRepository) {}
    
    async ejecutar(): Promise<ServiceResponse<Adopcion[]>> {
        const adopcion = await this.adopcionRepository.findAll();
        return {
            success: true,
            status: 200, 
            messages: ["Adopciones obtenidas exitosamente."], 
            data: adopcion 
        };
    }
}