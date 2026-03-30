import { Adoptante } from "../../entities/adoptante.entity.js";
import { Persona } from "../../entities/persona.entity.js";
import { EntityManager } from "@mikro-orm/core";
import { AdoptanteRepository } from "./adoptante.repositoty.js";

export class AdoptanteRepositoryORM implements AdoptanteRepository {
    constructor(private em: EntityManager) {};

    async findAll(): Promise<Adoptante[]> {
        return await this.em.find(Adoptante, {}, { populate: ['persona'] });
    };

    async findOne(numero_persona: number): Promise<Adoptante | null> {
        const persona = await this.em.findOne(Persona, { numero: numero_persona });
        if (!persona) return null;
        return await this.em.findOne(Adoptante, { persona: persona });
    };

    async create(adoptante: Adoptante): Promise<Adoptante> {
        this.em.persist(adoptante);
        await this.em.flush();
        return adoptante;
    };

    async update(adoptante: Adoptante, dto: Partial<Adoptante>): Promise<Adoptante> {
        this.em.assign(adoptante, dto);
        await this.em.flush();
        return adoptante;
    };

    async delete(numero: number): Promise<void> {
        const persona = await this.em.findOne(Persona, { numero: numero });
        if (!persona) return;
        const adoptante = await this.em.findOne(Adoptante, { persona: persona });
        if (adoptante) {
            this.em.remove(adoptante);
            await this.em.flush();
        };
    };
};