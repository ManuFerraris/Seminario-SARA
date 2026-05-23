import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class FindAllEntrevistas {
    constructor( private entRepo: EntrevistaRepository) {}
    async ejecutar (): Promise<ServiceResponse<Entrevista[]>> {
        const entrevistas = await this.entRepo.traerTodasEntrevistas();
        if (entrevistas.length === 0) {
            return {
                success: true,
                status: 200,
                messages: ["No se encontraron entrevistas"],
                data: entrevistas
            };
        };
        
        return {
            success: true,
            status:200,
            messages: ["Entrevistas encontradas"],
            data: entrevistas
        };
    };
}