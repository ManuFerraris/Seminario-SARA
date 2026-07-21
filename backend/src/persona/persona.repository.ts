import { Persona } from "../entities/persona.entity.js";

export interface PersonaRepository {
    findAll(): Promise<Persona[]>;
    findOne(dni: string): Promise<Persona | null>;
    findByEmail(email: string): Promise<Persona | null>;
    findByDNI(dni: string): Promise<Persona | null>;
    create(persona: Partial<Persona>): Promise<Persona>;
    update(persona:Persona, dto: Partial<Persona>): Promise<Persona>;
    delete(dni: string): Promise<void>;
};