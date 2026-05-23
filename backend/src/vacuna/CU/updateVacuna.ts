import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";
import { validarActualizacionVacuna } from "../validarActualizacionVacuna.js";

export class UpdateVacunas {
    constructor(private readonly vacunaRepository: VacunaRepository) {}

    async ejecutar(numero: number, dto: any): Promise<ServiceResponse<Vacuna | null>> {
        
        const errores = validarActualizacionVacuna(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        const vacuna = await this.vacunaRepository.getOneVacuna(numero);
        if (!vacuna) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró ninguna vacuna con el número ${numero}.`],
                data: undefined
            };
        }

        // Validación de Regla de Negocio (Cronología Parcial)
        // Determinamos cómo quedarán las fechas simulando la actualización
        console.log("Fecha vencimiento original:", vacuna.fecha_vencimiento);
        const fechaIngresoFinal = new Date(dto.fecha_ingreso ? dto.fecha_ingreso : vacuna.fecha_ingreso);
        const fechaVencimientoFinal = new Date(dto.fecha_vencimiento ? dto.fecha_vencimiento : vacuna.fecha_vencimiento);
        console.log("Fecha vencimiento final simulada:", fechaVencimientoFinal);

        if (fechaVencimientoFinal.getTime() <= fechaIngresoFinal.getTime()) {
            console.log("Error de cronología: fecha vencimiento final simulada es igual o anterior a fecha ingreso final simulada.");
            return {
                status: 400,
                success: false,
                messages: ["Conflicto cronológico: La fecha de vencimiento resultante sería igual o anterior a la fecha de ingreso."],
                data: undefined
            };
        }

        if (dto.droga !== undefined) vacuna.droga = dto.droga;
        if (dto.stock !== undefined) vacuna.stock = dto.stock;
        if (dto.fecha_ingreso) vacuna.fecha_ingreso = dto.fecha_ingreso.split('T')[0];
        if (dto.fecha_vencimiento) vacuna.fecha_vencimiento = dto.fecha_vencimiento.split('T')[0];

        console.log("Vacuna actualizada por enviar:", vacuna);
        const vacunaActualizada = await this.vacunaRepository.updateVacuna(numero, vacuna);

        console.log("Vacuna actualizada en base de datos:", vacunaActualizada);
        return {
            status: 200,
            success: true,
            messages: [`Vacuna número ${numero} actualizada exitosamente.`],
            data: vacunaActualizada
        };
    };
}