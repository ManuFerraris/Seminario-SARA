import { Persona } from "../entities/persona.entity.js";
import { Veterinario } from "../entities/veterinario.entity.js";
import { VeterinarioRepository } from "./vet.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class VeterinarioRepositoryORM implements VeterinarioRepository {
    constructor(private readonly em: EntityManager) {}

    async findAll(): Promise<Veterinario[]> {
        return await this.em.find(Veterinario, {});
    }

    async findOne(matricula: string): Promise<Veterinario | null> {
        return await this.em.findOne(Veterinario, { matricula });
    }

    async findOneByPersona(persona: Persona): Promise<Veterinario | null> {
        return await this.em.findOne(Veterinario, { persona });
    }

    async create(veterinario: Veterinario): Promise<Veterinario> {
        this.em.persist(veterinario);
        await this.em.flush();
        return veterinario;
    }

    async update(veterinario: Veterinario, dto: Partial<Veterinario>): Promise<Veterinario> {
        this.em.assign(veterinario, dto);
        await this.em.flush();
        return veterinario;
    }

    async delete(matricula: string): Promise<void> {
        const vet = await this.em.findOne(Veterinario, {matricula});
        if (vet) {
            this.em.remove(vet);
            await this.em.flush();
        }
    }
}