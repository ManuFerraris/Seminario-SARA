import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";
import { validarCreacionVacuna } from "../validarCreacionVacuna.js";

export class CreateVacuna {
    constructor(private readonly vacunaRepository: VacunaRepository) {}

    async ejecutar(dto: any): Promise<ServiceResponse<Vacuna>> {
        // 1. Validación Síncrona
        const errores = validarCreacionVacuna(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        const fechaIngreso = new Date(dto.fecha_ingreso);
        const fechaVencimiento = new Date(dto.fecha_vencimiento);

        // 2. Regla de Negocio: Cronología
        if (fechaVencimiento.getTime() <= fechaIngreso.getTime()) {
            return {
                status: 400,
                success: false,
                messages: ["Conflicto cronológico: La fecha de vencimiento no puede ser igual o anterior a la fecha de ingreso."],
                data: undefined
            };
        }

        // 3. Mapeo y Persistencia
        const nuevaVacuna = new Vacuna();
        nuevaVacuna.droga = dto.droga.trim();
        nuevaVacuna.stock = dto.stock;
        nuevaVacuna.fecha_ingreso = fechaIngreso;
        nuevaVacuna.fecha_vencimiento = fechaVencimiento;

        const vacunaCreada = await this.vacunaRepository.createVacuna(nuevaVacuna);

        return {
            status: 201,
            success: true,
            messages: ["Vacuna ingresada al inventario exitosamente."],
            data: vacunaCreada
        };
    }
}