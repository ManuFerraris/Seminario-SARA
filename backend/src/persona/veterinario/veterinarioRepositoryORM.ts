import { Veterinario } from "../../entities/veterinario.entity.js";
import { Persona } from "../../entities/persona.entity.js";
import { EntityManager } from "@mikro-orm/core";
import { VeterinarioRepository } from "./veterinario.repository.js";

export class VeterinarioRepositoryORM implements VeterinarioRepository {
    constructor(private em: EntityManager) {};

    async findAll(): Promise<Veterinario[]> {
        return await this.em.find(Veterinario, {}, { populate: ['persona'] });
    };

    async findOne(numero_persona: number): Promise<Veterinario | null> {
        const persona = await this.em.findOne(Persona, { numero: numero_persona });
        if (!persona) return null;
        return await this.em.findOne(Veterinario, { persona: persona });
    };

    async create(veterinario: Veterinario): Promise<Veterinario> {
        this.em.persist(veterinario);
        await this.em.flush();
        return veterinario;
    };

    async update(veterinario: Veterinario, dto: Partial<Veterinario>): Promise<Veterinario> {
        this.em.assign(veterinario, dto);
        await this.em.flush();
        return veterinario;
    };

    async delete(numero: number): Promise<void> {
        const persona = await this.em.findOne(Persona, { numero: numero });
        if (!persona) return;
        const veterinario = await this.em.findOne(Veterinario, { persona: persona });
        if (veterinario) {
            this.em.remove(veterinario);
            await this.em.flush();
        }; 
    };
};