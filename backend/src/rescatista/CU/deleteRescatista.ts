/*
import { Rescatista } from "../../entities/rescatista.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescatistaRepository } from "../rescatista.repository.js";

export class DeteleRescatista {
    constructor(private rescatistaRepository: RescatistaRepository) {}
    async ejecutar(numero:number): Promise<ServiceResponse<void>> {
        const rescatista = await this.rescatistaRepository.getOneRescatista(numero);
        if (!rescatista) {
            return {
                status: 404,
                success: false,
                messages: [`Rescatista con numero ${numero} no encontrado`],
                data: undefined,
            };
        }
        await this.rescatistaRepository.deleteRescatista(rescatista);
        return {
            status: 200,
            success: true,
            messages: [`Rescatista con numero ${numero} eliminado`],
            data: undefined,
        };
    };
}
*/