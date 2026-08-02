import { AdoptanteRepository } from './ado.repository.js';
import { Adoptante } from '../entities/adoptante.entity.js';
import { EntityManager } from '@mikro-orm/core';
import { Persona } from '../entities/persona.entity.js';

export class AdoptanteRepositoryORM implements AdoptanteRepository {
    constructor(private readonly em: EntityManager) {}

    async findAll(): Promise<Adoptante[]> {
        return await this.em.find(Adoptante, {});
    }

    async findOne(id_adoptante: number): Promise<Adoptante | null> {
        return await this.em.findOne(Adoptante, { id_adoptante });
    }

    async findByDni(id_adoptante: number): Promise<Adoptante | null> {
        return await this.em.findOne(Adoptante, { id_adoptante });
    }

    async findOneByPersona(persona: Persona): Promise<Adoptante | null> {
        return await this.em.findOne(Adoptante, { persona });
    }

    async create(adoptante: Adoptante): Promise<Adoptante> {
        this.em.persist(adoptante);
        await this.em.flush();
        return adoptante;
    }

    async update(adoptante: Adoptante, dto: Partial<Adoptante>): Promise<Adoptante> {
        this.em.assign(adoptante, dto);
        await this.em.flush();
        return adoptante;
    }

    async delete(id_adoptante: number): Promise<void> {
        const adopt = await this.em.findOne(Adoptante, { id_adoptante });
        if (adopt) {
            this.em.remove(adopt);
            await this.em.flush();
        }
    }
}