import { Rescate } from "../entities/rescate.entity.js";
import { Persona } from "../entities/persona.entity.js";
import { Animal } from "../entities/animal.entity.js";

export interface RescateRepository {
    findAllRescate(): Promise<Rescate[]>;
    getOneRescate(nro_rescate: number): Promise<Rescate | null>;
    createRescate(rescate: Rescate): Promise<Rescate>;
    updateRescate(rescate: Rescate): Promise<Rescate | null>;
    deleteRescate(rescate: Rescate): Promise<void>;
    buscarRescatePorRelaciones(persona: Persona, animal: Animal, fecha: Date): Promise<Rescate | null>;
}