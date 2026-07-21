import { Vacuna } from "../entities/vacuna.entity.js";
import { VacunaRepository } from "./vacuna.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class VacunaRepositoryORM implements VacunaRepository {

    constructor(private em: EntityManager){};

    async findAllVacunas(): Promise<Vacuna[]> {
        return await this.em.find(Vacuna, {});
    };

    async getOneVacuna(numero: number): Promise<Vacuna | null> {
        return await this.em.findOne(Vacuna, { nro_vacuna: numero });
    };

    async createVacuna(vacuna: Vacuna): Promise<Vacuna> {
        this.em.persist(vacuna);
        await this.em.flush();
        return vacuna;
    };

    async updateVacuna(numero: number, vacuna: Vacuna): Promise<Vacuna | null> {
        const existingVacuna = await this.em.findOne(Vacuna, { nro_vacuna: numero });
        if (!existingVacuna) {
            return null;
        }
        this.em.assign(existingVacuna, vacuna);
        await this.em.flush();
        return existingVacuna;
    };

    async deleteVacuna(vacuna: Vacuna): Promise<void> {
        if (vacuna) {
            this.em.remove(vacuna);
            await this.em.flush();
        }
    }
}