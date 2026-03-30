import { AdoptanteRepository } from "../adoptante.repositoty.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class DeleteAdoptante{
    constructor(private adoptanteRepository: AdoptanteRepository) {};

    async ejecutar(numero_persona: number): Promise<ServiceResponse<null>> {
        const adoptante = await this.adoptanteRepository.findOne(numero_persona);
        if (!adoptante) {
            return {
                status: 404,
                success: false,
                messages: ["Adoptante no encontrado"],
                data: null
            };
        };
        await this.adoptanteRepository.delete(numero_persona);
        return {
            status: 200,
            success: true,
            messages: ["Adoptante eliminado exitosamente"],
            data: null
        };
    };
};