import { Vacuna } from "../entities/vacuna.entity.js";
import { VacunaDTO } from "./vacunaDTO.js";

export interface VacunaRepository {
    findAllVacunas(): Promise<Vacuna[]>;
    getOneVacuna(numero: number): Promise<Vacuna | null>;
    createVacuna(vacuna: VacunaDTO): Promise<Vacuna>;
    updateVacuna(numero: number, vacuna: VacunaDTO): Promise<Vacuna | null>;
    deleteVacuna(vacuna: Vacuna): Promise<void>;
}