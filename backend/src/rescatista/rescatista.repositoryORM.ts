/*
import { Rescatista } from "../entities/rescatista.entity.js";
import { RescatistaRepository } from "./rescatista.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class RescatistaRepositoryORM implements RescatistaRepository {
    constructor(private em: EntityManager){};
    async findAllRescatista(): Promise<Rescatista[]> {
        return await this.em.find(Rescatista, {});
    };

    async getOneRescatista(numero: number): Promise<Rescatista | null> {
        return await this.em.findOne(Rescatista, { numero });
    };

    async createRescatista(rescatista: Rescatista): Promise<Rescatista> {
        this.em.persist(rescatista);
        await this.em.flush();
        return rescatista;
    };

    async updateRescatista(rescatista: Rescatista): Promise<Rescatista | null> {
        await this.em.flush();
        return rescatista;
    };

    async deleteRescatista(rescatista: Rescatista): Promise<void> {
        this.em.remove(rescatista);
        await this.em.flush();
        return;
    };

    async findOneByDNI(dni: string): Promise<Rescatista | null> {
        return await this.em.findOne(Rescatista, { dni });
    };
}
*/