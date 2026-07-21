import { AdopcionRepository } from "./../adopcion.repository.js";
import { Adopcion } from "../../entities/adopcion.entity.js";
import { AdopcionDTO } from "./../adopcionDTO.js";
import { ServiceResponse } from "../../types/service.response";
import { validarActualizacionAdopcion } from "../validarActualizacionAdopcion.js";

export class UpdateAdopcion {
    constructor(private readonly adopcionRepository: AdopcionRepository) {}

    async ejecutar(numero: number, dto: Partial<AdopcionDTO>): Promise<ServiceResponse<Adopcion>> {
        // 1. Validaciones previas
        const errores = validarActualizacionAdopcion(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const adopcion = await this.adopcionRepository.getOneAdopcion(numero);
        if (!adopcion) {
            return { status: 404, success: false, messages: ["Adopción no encontrada."], data: undefined };
        }

        // 2. Construimos el objeto de actualización con los tipos correctos (Dates en vez de strings)
        const datosActualizados: Partial<Adopcion> = {};

        if (dto.fecha_adopcion !== undefined) {
            datosActualizados.fecha_adopcion = new Date(dto.fecha_adopcion);
        }

        if (dto.fecha_retiro !== undefined) {
            // Manejamos el null/undefined por si se anula un retiro
            datosActualizados.fecha_retiro = dto.fecha_retiro ? new Date(dto.fecha_retiro) : undefined;
        }

        if (dto.motivos_retiro !== undefined) {
            datosActualizados.motivos_retiro = dto.motivos_retiro;
        }

        if (dto.evidencia_maltrato !== undefined) {
            datosActualizados.evidencia_maltrato = dto.evidencia_maltrato;
        }

        // Validación de regla de negocio: cronología (usando las fechas ya parseadas o las originales)
        const fechaAdopcionCheck = datosActualizados.fecha_adopcion || adopcion.fecha_adopcion;
        const fechaRetiroCheck = datosActualizados.fecha_retiro !== undefined ? datosActualizados.fecha_retiro : adopcion.fecha_retiro;

        if (fechaRetiroCheck && fechaRetiroCheck.getTime() < fechaAdopcionCheck.getTime()) {
            return { status: 400, success: false, messages: ["La fecha de retiro no puede ser anterior a la de adopción."], data: undefined };
        }

        // 3. Ejecutamos el update pasando la entidad y nuestro objeto Partial<Adopcion> tipado correctamente
        await this.adopcionRepository.updateAdopcion(adopcion, datosActualizados);

        return { status: 200, success: true, messages: ["Adopción actualizada exitosamente."], data: adopcion };
    }
}