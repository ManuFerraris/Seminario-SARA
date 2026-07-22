import { Vacuna } from "../entities/vacuna.entity.js";
import { VacunaDTO } from "./vacunaDTO.js";

export interface VacunaRepository {
    findAllVacunas(): Promise<Vacuna[]>;
    getOneVacuna(numero: number): Promise<Vacuna | null>;
    createVacuna(vacuna: VacunaDTO): Promise<Vacuna>;
    updateVacuna(dto: VacunaDTO, vacuna: Vacuna): Promise<Vacuna | null>;
    deleteVacuna(vacuna: Vacuna): Promise<void>;
    actualizarStock(cantidad: number, vacuna: Vacuna): Promise<void>;
}