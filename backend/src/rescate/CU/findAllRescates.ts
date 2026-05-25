import { Rescate } from "../../entities/rescate.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";

export class FindAllRescates {
    constructor(private rescateRepository: RescateRepository) {}
    async ejecutar(): Promise<ServiceResponse<Rescate[]>> {
        const rescates = await this.rescateRepository.findAllRescate();
        return {
            success: true,
            status:200,
            messages: ["Rescates encontrados"],
            data: rescates,
        };
    };
}