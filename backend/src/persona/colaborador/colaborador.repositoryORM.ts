import { EntityManager } from "@mikro-orm/core";
import { Colaborador } from "../../entities/colaborador.entity.js";
import { ColaboradorRepository } from "./colaborador.repository.js";

export class ColaboradorRepositoryORM implements ColaboradorRepository {
    constructor(private em: EntityManager) {}
    
    async findAll(): Promise<Colaborador[]> {
        return await this.em.find(Colaborador, {}, { populate: ['persona'] });
    };

    async findOne(id_colaborador: string): Promise<Colaborador | null> {
        const colaborador = await this.em.findOne(Colaborador, { id: id_colaborador });
        if(!colaborador) return null;
        return colaborador;
    };

    async create(colaborador: Colaborador): Promise<Colaborador> {
        this.em.persist(colaborador);
        await this.em.flush();
        return colaborador;
    };

    async update(colaborador: Colaborador, dto: Partial<Colaborador>): Promise<Colaborador> {
        this.em.assign(colaborador, dto);
        await this.em.flush();
        return colaborador;
    };

    async delete(id_colaborador: string): Promise<void> {
        const colaborador = await this.em.findOne(Colaborador, { id: id_colaborador });
        if (!colaborador) return;
        this.em.remove(colaborador);
            await this.em.flush();
    };
};