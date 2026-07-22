import { Adopcion } from "../entities/adopcion.entity.js";
import { AdopcionRepository } from "./adopcion.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class AdopcionRepositoryORM implements AdopcionRepository {
    constructor(private readonly em:EntityManager){};

    async findAll(): Promise<Adopcion[]> {
        return await this.em.find(Adopcion, {});
    };

    async getOneAdopcion(nro_adopcion: number): Promise<Adopcion | null> {
        return await this.em.findOne(Adopcion, { nro_adopcion });
    };

    async createAdopcion(adopcion: Adopcion): Promise<Adopcion> {
        this.em.persist(adopcion);
        await this.em.flush();
        return adopcion;
    };

    async updateAdopcion(adopcion: Adopcion, dto: Partial<Adopcion>): Promise<Adopcion> {
        this.em.assign(adopcion, dto);
        await this.em.flush();
        return adopcion;
    };

    async delete(adopcion: Adopcion): Promise<void> {
        this.em.remove(adopcion);
        await this.em.flush();
    };
}