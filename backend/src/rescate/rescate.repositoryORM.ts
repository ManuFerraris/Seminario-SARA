import { Rescate } from "../entities/rescate.entity.js";
import { Persona } from "../entities/persona.entity.js";
import { Animal } from "../entities/animal.entity.js";
import { RescateRepository } from "./rescate.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class RescateRepositoryORM implements RescateRepository {
    constructor(private em: EntityManager) {}
    async findAllRescate(): Promise<Rescate[]> {
        return await this.em.find(Rescate, {}, { populate: ['persona', 'animal'] });
    };

    async getOneRescate(numero_p: number, numero_a: number, fecha_hora: Date): Promise<Rescate | null> {
        // MikroORM mapea los números directamente a las Foreign Keys
        return await this.em.findOne(Rescate, { 
            persona: { numero: numero_p }, 
            animal: { numero: numero_a }, 
            fecha_hora: fecha_hora 
        }, { populate: ['persona', 'animal'] }); 
    };

    async createRescate(rescate: Rescate): Promise<Rescate> {
        await this.em.persist(rescate);
        this.em.flush();
        return rescate;
    };

    async updateRescate(rescate: Rescate): Promise<Rescate | null> {
        await this.em.flush();
        return rescate;
    };

    async deleteRescate(rescate: Rescate): Promise<void> {
        await this.em.remove(rescate);
        await this.em.flush();
        return;
    };
}