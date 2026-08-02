import { Colaborador } from "../entities/colaborador.entity.js";
import { Persona } from "../entities/persona.entity.js";
import { ColaboradorRepository } from "./col.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class ColaboradorRepositoryORM implements ColaboradorRepository {
    constructor(private readonly em: EntityManager) {}

    async findAll(): Promise<Colaborador[]> {
        return await this.em.find(Colaborador, {});
    }

    async findOne(id_colaborador: number): Promise<Colaborador | null> {
        return await this.em.findOne(Colaborador, { id_colaborador });
    }

    async findByDni(id_colaborador: number): Promise<Colaborador | null> {
        return await this.em.findOne(Colaborador, { id_colaborador });
    }

    async findOneByPersona(persona: Persona): Promise<Colaborador | null> {
        return await this.em.findOne(Colaborador, { persona });
    }

    async create(colaborador: Colaborador): Promise<Colaborador> {
        this.em.persist(colaborador);
        await this.em.flush();
        return colaborador;
    }

    async update(colaborador: Colaborador, dto: Partial<Colaborador>): Promise<Colaborador> {
        this.em.assign(colaborador, dto);
        await this.em.flush();
        return colaborador;
    }

    async delete(id_colaborador: number): Promise<void> {
        const col = await this.em.findOne(Colaborador, { id_colaborador });
        if (col) {
            this.em.remove(col);
            await this.em.flush();
        }
    }
}