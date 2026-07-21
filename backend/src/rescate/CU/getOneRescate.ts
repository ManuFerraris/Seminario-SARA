import { Rescate } from "../../entities/rescate.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";

export class GetOneRescates {
    constructor(private rescateRepository: RescateRepository) {}
    
    async ejecutar(nro_rescate: number): Promise<ServiceResponse<Rescate>> {

        const rescate = await this.rescateRepository.getOneRescate(nro_rescate);
        
        if (!rescate) {
            return {
                success: false,
                status: 404,
                messages: ["Rescate no encontrado"],
                data: undefined,
            };
        }
        
        return {
            success: true,
            status: 200,
            messages: ["Rescate encontrado"],
            data: rescate
        };
    }
}