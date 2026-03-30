import { Persona } from "../entities/persona.entity.js";

export interface PersonaRepository {
    findAll(): Promise<Persona[]>;
    findOne(numero: number): Promise<Persona | null>;
    findByEmail(email: string): Promise<Persona | null>;
    findByDNI(dni: string): Promise<Persona | null>;
    create(persona: Persona): Promise<Persona>;
    update(persona:Persona, dto: Partial<Persona>): Promise<Persona>;
    delete(numero: number): Promise<void>;
};