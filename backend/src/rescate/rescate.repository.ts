import { Rescate } from "../entities/rescate.entity.js";

export interface RescateRepository {
    findAllRescate(): Promise<Rescate[]>;
    getOneRescate(numero_p: number, numero_a: number, fecha_hora: Date): Promise<Rescate | null>;
    createRescate(rescate: Rescate): Promise<Rescate>;
    updateRescate(rescate: Rescate): Promise<Rescate | null>;
    deleteRescate(rescate: Rescate): Promise<void>;
}