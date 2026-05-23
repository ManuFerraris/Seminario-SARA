import { Vacuna } from "../../entities/vacuna.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { VacunaRepository } from "../vacuna.repository.js";
import { validarCreacionVacuna } from "../validarCreacionVacuna.js";

export class CreateVacunas {
    constructor(private readonly vacunaRepository: VacunaRepository) {}

    async ejecutar(dto: any): Promise<ServiceResponse<Vacuna>> {
        const errores = validarCreacionVacuna(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        const nuevaVacuna = new Vacuna();
        nuevaVacuna.droga = dto.droga;
        nuevaVacuna.stock = dto.stock;
        
        // Convertimos los strings del JSON a objetos Date para MikroORM
        nuevaVacuna.fecha_ingreso = new Date(dto.fecha_ingreso);
        nuevaVacuna.fecha_vencimiento = new Date(dto.fecha_vencimiento);

        const vacunaCreada = await this.vacunaRepository.createVacuna(nuevaVacuna);

        return {
            status: 201,
            success: true,
            messages: ["Vacuna ingresada al inventario exitosamente."],
            data: vacunaCreada
        };
    }
}