import { Persona } from "../entities/persona.entity.js";
import { PersonaRepository } from "./persona.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class PersonaRepositoryORM implements PersonaRepository {
    constructor(private em: EntityManager){};

    async findAll(): Promise<Persona[]> {
        return await this.em.find(Persona, {});
    };

    async findOne(dni: string): Promise<Persona | null> {
        return await this.em.findOne(Persona, { dni });
    };

    async findByEmail(email: string): Promise<Persona | null> {
        return await this.em.findOne(Persona, { email });
    };

    async findByDNI(dni: string): Promise<Persona | null> {
        return await this.em.findOne(Persona, { dni });
    };

    async create(persona: Persona): Promise<Persona> {
        this.em.persist(persona);
        await this.em.flush();
        return persona;
    };

    async update(persona: Persona, dto: Partial<Persona>): Promise<Persona> {
        this.em.assign(persona, dto);
        await this.em.flush();
        return persona;
    };

    async delete(dni: string): Promise<void> {
        const persona = await this.em.findOne(Persona, {dni});
        if (persona) {
            this.em.remove(persona);
            await this.em.flush();
        };
    };
};