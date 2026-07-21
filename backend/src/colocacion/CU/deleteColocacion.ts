import { ColocacionRepository } from '../colocacion.repository.js';
import { ServiceResponse } from '../../types/service.response.js';

export class DeleteColocacion {
    constructor(private readonly colocacionRepository: ColocacionRepository) {}

    async ejecutar(numero: number): Promise<ServiceResponse<void>> {
        const colocacion = await this.colocacionRepository.getOneColocacion(numero);
        if (!colocacion) {
            return { status: 404, success: false, messages: ["Colocación no encontrada para eliminar."], data: undefined };
        }

        await this.colocacionRepository.delete(colocacion);
        return { status: 200, success: true, messages: ["Colocación eliminada exitosamente."], data: undefined };
    }
}
