import { FichaMedicaRepository } from "../fichaMedica.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class DeleteFichaMedica {
    constructor(private readonly fichaMedicaRepository: FichaMedicaRepository) {}

    async ejecutar(numero: number): Promise<ServiceResponse<void>> {
        const ficha = await this.fichaMedicaRepository.getOneFichaMedica(numero);
        if (!ficha) {
            return { status: 404, success: false, messages: ["Ficha médica no encontrada para eliminar."], data: undefined };
        }

        await this.fichaMedicaRepository.delete(ficha);
        return { status: 200, success: true, messages: ["Ficha médica eliminada exitosamente."], data: undefined };
    }
}