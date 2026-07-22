import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";
import { validarActualizacionVacuna } from "../validarActualizacionVacuna.js";
import { VacunaDTO } from "../vacunaDTO.js"

export class UpdateVacuna {
    constructor(private readonly vacunaRepository: VacunaRepository) {}

    async ejecutar(numero: number, dto: VacunaDTO): Promise<ServiceResponse<Vacuna | null>> {

        // 1. Búsqueda
        const vacuna = await this.vacunaRepository.getOneVacuna(numero);
        if (!vacuna) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró ninguna vacuna con el número ${numero}.`],
                data: undefined
            };
        }

        // 2. Validación Síncrona
        const errores = validarActualizacionVacuna(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        // 3. Regla de Negocio: Cronología Parcial (Simulación)
        const fechaIngresoFinal = dto.fecha_ingreso ? new Date(dto.fecha_ingreso) : new Date(vacuna.fecha_ingreso);
        const fechaVencimientoFinal = dto.fecha_vencimiento ? new Date(dto.fecha_vencimiento) : new Date(vacuna.fecha_vencimiento);

        if (fechaVencimientoFinal.getTime() <= fechaIngresoFinal.getTime()) {
            return {
                status: 400,
                success: false,
                messages: ["Conflicto cronológico: La fecha de vencimiento resultante sería igual o anterior a la fecha de ingreso."],
                data: undefined
            };
        }

        // 4. Actualización Selectiva
        if (dto.droga !== undefined) dto.droga = dto.droga.trim();
        if (dto.stock !== undefined) dto.stock = dto.stock;
        
        // Instanciamos a Date en lugar de asignar el string .split('T')[0]
        if (dto.fecha_ingreso !== undefined) dto.fecha_ingreso = fechaIngresoFinal;
        if (dto.fecha_vencimiento !== undefined) dto.fecha_vencimiento = fechaVencimientoFinal;

        // Si tu repositorio necesita el número como argumento, lo pasamos (aunque si la PK está en 'vacuna', solo el objeto debería bastar)
        const vacunaActualizada = await this.vacunaRepository.updateVacuna(dto, vacuna);

        return {
            status: 200,
            success: true,
            messages: [`Vacuna número ${numero} actualizada exitosamente.`],
            data: vacunaActualizada
        };
    }
}