import { AdopcionRepository } from "../../adopcion/adopcion.repository";
import { Seguimiento } from "../../entities/seguimiento.entity";
import { ServiceResponse } from "../../types/service.response";
import { SeguimientoRepository } from "../seg.repository";
import { SeguimientoDTO } from "../seguimientoDTO";
import { validarActualizacionSeguimiento } from "../validarActualizacionSeguimiento";

export class UpdateSeguimiento {
    constructor(
        private readonly seguimientoRepository: SeguimientoRepository,
        private readonly adopcionRepository: AdopcionRepository
    ) {}

    async ejecutar(id_seguimiento: number, dto: Partial<SeguimientoDTO>): Promise<ServiceResponse<Seguimiento>> {
        const errores = validarActualizacionSeguimiento(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const seguimiento = await this.seguimientoRepository.getOne(id_seguimiento);
        if (!seguimiento) {
            return { status: 404, success: false, messages: ["Seguimiento no encontrado para actualizar."], data: undefined };
        }

        const datosActualizados: Partial<Seguimiento> = {};
        
        // Manejo de cambio de Adopción (poco común pero posible) y fechas para la regla de negocio
        let adopcionReferencia = seguimiento.adopcion;

        if (dto.nro_adopcion !== undefined) {
            const nuevaAdopcion = await this.adopcionRepository.getOneAdopcion(dto.nro_adopcion);
            if (!nuevaAdopcion) return { status: 404, success: false, messages: ["La nueva adopción indicada no existe."], data: undefined };
            datosActualizados.adopcion = nuevaAdopcion;
            adopcionReferencia = nuevaAdopcion;
        }

        if (dto.fecha_seguimiento !== undefined) {
            datosActualizados.fecha_seguimiento = new Date(dto.fecha_seguimiento);
        }

        const fechaSeguimientoFinal = datosActualizados.fecha_seguimiento || seguimiento.fecha_seguimiento;
        if (fechaSeguimientoFinal.getTime() < adopcionReferencia.fecha_adopcion.getTime()) {
            return { status: 400, success: false, messages: ["Conflicto cronológico: La fecha del seguimiento no puede ser anterior a la fecha de adopción."], data: undefined };
        }

        if (dto.estado_animal !== undefined) datosActualizados.estado_animal = dto.estado_animal.trim();
        if (dto.entorno !== undefined) datosActualizados.entorno = dto.entorno.trim();

        await this.seguimientoRepository.updateSeguimiento(seguimiento, datosActualizados);

        return { status: 200, success: true, messages: ["Seguimiento actualizado exitosamente."], data: seguimiento };
    }
}