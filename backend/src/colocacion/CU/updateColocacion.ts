import { Colocacion } from "../../entities/colocacion.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { ColocacionRepository } from "../colocacion.repository.js";
import { validarActualizacionColocacion } from "../validarActualizacionColocacion.js";
import { FichaMedicaRepository } from "../../fichaMedica/fichaMedica.repository.js";
import { ColocacionDTO } from "../colocacionDTO.js";
import { VacunaRepository } from "../../vacuna/vacuna.repository.js";

export class UpdateColocacion {
    constructor(
        private readonly colocacionRepository: ColocacionRepository,
        private readonly fichaRepository: FichaMedicaRepository,
        private readonly vacunaRepository: VacunaRepository
    ) {}

    async ejecutar(numero: number, dto: Partial<ColocacionDTO>): Promise<ServiceResponse<Colocacion>> {
        const errores = validarActualizacionColocacion(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const colocacion = await this.colocacionRepository.getOneColocacion(numero);
        if (!colocacion) {
            return { status: 404, success: false, messages: ["Colocación no encontrada para actualizar."], data: undefined };
        }

        // Traducimos el DTO a un Partial<Colocacion> con los tipos correctos para el repositorio
        const datosActualizados: Partial<Colocacion> = {};

        if (dto.nro_ficha !== undefined) {
            const ficha = await this.fichaRepository.getOneFichaMedica(dto.nro_ficha);
            if (!ficha) return { status: 404, success: false, messages: ["La nueva ficha médica no existe."], data: undefined };
            datosActualizados.ficha = ficha;
        }

        if (dto.nro_vacuna !== undefined) {
            const vacuna = await this.vacunaRepository.getOneVacuna(dto.nro_vacuna);
            if (!vacuna) return { status: 404, success: false, messages: ["La nueva vacuna no existe."], data: undefined };
            datosActualizados.vacuna = vacuna;
        }

        if (dto.fecha_colocacion !== undefined) {
            datosActualizados.fecha_hora = new Date(dto.fecha_colocacion);
        }

        if (dto.cantidad !== undefined) {
            datosActualizados.cantidad = dto.cantidad;
        }

        await this.colocacionRepository.updateColocacion(colocacion, datosActualizados);

        return { status: 200, success: true, messages: ["Colocación actualizada exitosamente."], data: colocacion };
    }
}