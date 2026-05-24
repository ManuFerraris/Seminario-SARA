/*
import { Rescatista } from "../../entities/rescatista.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescatistaRepository } from "../rescatista.repository.js";

export class FindAllRescatista {
    constructor(private rescatistaRepository: RescatistaRepository) {}
    async ejecutar(): Promise<ServiceResponse<Rescatista[]>> {
        const rescatistas = await this.rescatistaRepository.findAllRescatista();
        return {
            status: 200,
            success: true,
            messages: ["Rescatistas encontrados"],
            data: rescatistas,
        };
    };
}
*/