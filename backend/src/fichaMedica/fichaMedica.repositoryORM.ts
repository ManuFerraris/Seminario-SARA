import { FichaMedica } from "../entities/ficha-medica.entity.js";
import { FichaMedicaRepository } from "./fichaMedica.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class FichaMedicaRepositoryORM implements FichaMedicaRepository {
    constructor(private readonly em:EntityManager){}

    async findAll(): Promise<FichaMedica[]> {
        return await this.em.find(FichaMedica, {});
    };

    async getOneFichaMedica(nro_ficha: number): Promise<FichaMedica | null> {
        return await this.em.findOne(FichaMedica, { nro_ficha });
    };

    async createFichaMedica(fichaMedica: FichaMedica): Promise<FichaMedica> {
        this.em.persist(fichaMedica);
        await this.em.flush();
        return fichaMedica;
    };

    async updateFichaMedica(fichaMedica: FichaMedica, dto: Partial<FichaMedica>): Promise<FichaMedica> {
        this.em.assign(fichaMedica, dto);
        await this.em.flush();
        return fichaMedica;
    };

    async delete(fichaMedica: FichaMedica): Promise<void> {
        this.em.remove(fichaMedica);
        await this.em.flush();
    };
}