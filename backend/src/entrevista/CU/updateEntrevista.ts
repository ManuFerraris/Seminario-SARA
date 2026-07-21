import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarActualizacionEntrevista } from "../validarActualizacionEntrevista.js";

export class UpdateEntrevista {
    constructor(private entRepo: EntrevistaRepository) {}

    async ejecutar(id_entrevista: number, dto: any): Promise<ServiceResponse<Entrevista>> {
        
        // 1. Validación sintáctica
        const errores = validarActualizacionEntrevista(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        // 2. Buscar la entrevista original por su ID subrogado
        const entrevista = await this.entRepo.buscarEntrevista(id_entrevista);
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["No se encontró la entrevista solicitada para actualizar."],
                data: undefined
            };
        }

        // 3. Lógica de Negocio: Validar cronología de reposición
        const fechaRepActual = new Date(entrevista.fecha_hora_rep);
        const fechaRepNueva = dto.fecha_hora_rep ? new Date(dto.fecha_hora_rep) : fechaRepActual;
        
        if (dto.fecha_hora_rep && fechaRepNueva.getTime() <= fechaRepActual.getTime()) {
            return {
                status: 400,
                success: false,
                messages: ["Conflicto cronológico: La nueva fecha de reposición no puede ser anterior a la actual."],
                data: undefined
            };
        }

        // 4. Mapeo selectivo de actualización
        if (dto.fecha_hora_rep) entrevista.fecha_hora_rep = fechaRepNueva;
        if (dto.estado !== undefined) entrevista.estado = dto.estado;
        if (dto.descripcion !== undefined) entrevista.descripcion = dto.descripcion;
        if (dto.aprobada !== undefined) entrevista.aprobada = dto.aprobada;

        // 5. Persistencia
        const entrevistaActualizada = await this.entRepo.actualizarEntrevista(entrevista);

        return {
            success: true,
            status: 200,
            messages: ["Entrevista actualizada exitosamente"],
            data: entrevistaActualizada
        };
    }
}