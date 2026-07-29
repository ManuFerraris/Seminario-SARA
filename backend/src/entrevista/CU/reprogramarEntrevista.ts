import { Entrevista } from "../../entities/entrevista.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { EntrevistaRepository } from "../entrevista.repository.js";

export class ReprogramarEntrevista {
    constructor(private entRepo: EntrevistaRepository) {}

    async ejecutar(id_entrevista: number, dto: any): Promise<ServiceResponse<Entrevista>> {
        
        // 1. Buscar la entrevista original
        const entrevista = await this.entRepo.buscarEntrevista(id_entrevista);
        
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["No se encontró la entrevista a reprogramar."],
                data: undefined
            };
        }

        if (entrevista.estado !== 'Pendiente') {
            return {
                success: false,
                status: 400,
                messages: ["Solo se pueden reprogramar entrevistas que estén en estado Pendiente."],
                data: undefined
            };
        }

        // 2. Armar la fecha nueva a partir de los strings del DTO (ej: "2026-08-15" y "14:30")
        const nuevaFechaHoraStr = `${dto.nuevaFecha}T${dto.nuevaHora}:00`;
        const nuevaFechaHora = new Date(nuevaFechaHoraStr);
        const ahora = new Date();

        // 3. Validaciones cronológicas
        if (isNaN(nuevaFechaHora.getTime())) {
            return {
                status: 400,
                success: false,
                messages: ["El formato de fecha u hora enviado es inválido."],
                data: undefined
            };
        }

        if (nuevaFechaHora <= ahora) {
            return {
                status: 400,
                success: false,
                messages: ["Conflicto cronológico: La nueva fecha de reprogramación debe ser en el futuro."],
                data: undefined
            };
        }

        // 4. Mapeo de actualización
        entrevista.fecha_hora_rep = nuevaFechaHora;
        entrevista.descripcion = dto.descripcion;
        // Nos aseguramos de que siga estando pendiente para ser evaluada en el futuro
        entrevista.estado = 'Pendiente'; 

        // 5. Persistencia
        const entrevistaActualizada = await this.entRepo.actualizarEntrevista(entrevista);

        return {
            success: true,
            status: 200,
            messages: ["Entrevista reprogramada exitosamente."],
            data: entrevistaActualizada
        };
    }
}