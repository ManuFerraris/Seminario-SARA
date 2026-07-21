import { Colocacion } from "../entities/colocacion.entity.js";
import { ColocacionRepository } from "./colocacion.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class ColocacionRepositoryORM implements ColocacionRepository {
    constructor(private readonly em:EntityManager){}

    async findAll(): Promise<Colocacion[]> {
        return await this.em.find(Colocacion, {});
    };

    async getOneColocacion(nro_colocacion: number): Promise<Colocacion | null> {
        return await this.em.findOne(Colocacion, { nro_colocacion });
    };

    async createColocacion(colocacion: Colocacion): Promise<Colocacion> {
        this.em.persist(colocacion);
        await this.em.flush();
        return colocacion;
    };

    async updateColocacion(colocacion: Colocacion, dto: Partial<Colocacion>): Promise<Colocacion> {
        this.em.assign(colocacion, dto);
        await this.em.flush();
        return colocacion;
    };

    async delete(colocacion: Colocacion): Promise<void> {
        this.em.remove(colocacion);
        await this.em.flush();
    };
}