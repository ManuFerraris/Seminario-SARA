import { Persona } from "../entities/persona.entity.js";
import { Veterinario } from "../entities/veterinario.entity.js";

export interface VeterinarioRepository {
    findAll(): Promise<Veterinario[]>;
    findOne(matricula: string): Promise<Veterinario | null>;
    findOneByPersona(persona: Persona): Promise<Veterinario | null>;
    create(veterinario: Partial<Veterinario>): Promise<Veterinario>;
    update(veterinario:Veterinario, dto: Partial<Veterinario>): Promise<Veterinario>;
    delete(matricula: string): Promise<void>;
};