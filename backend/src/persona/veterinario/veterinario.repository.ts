import { Veterinario } from "../../entities/veterinario.entity.js";

export interface VeterinarioRepository {
    findAll(): Promise<Veterinario[]>;
    findOne(numero_persona: number): Promise<Veterinario | null>;
    create(veterinario: Veterinario): Promise<Veterinario>;
    update(veterinario: Veterinario, dto: Partial<Veterinario>): Promise<Veterinario>;
    delete(numero_persona: number): Promise<void>;
}