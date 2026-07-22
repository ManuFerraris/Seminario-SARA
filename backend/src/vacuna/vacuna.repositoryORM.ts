import { Vacuna } from "../entities/vacuna.entity.js";
import { VacunaDTO } from "./vacunaDTO.js";
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


    async updateVacuna(dto: VacunaDTO, vacuna: Vacuna): Promise<Vacuna | null> {
        this.em.assign(vacuna, dto);
        await this.em.flush();
        return vacuna;
    };

    async deleteVacuna(vacuna: Vacuna): Promise<void> {
        if (vacuna) {
            this.em.remove(vacuna);
            await this.em.flush();
        }
    }

    async actualizarStock(cantidad: number, vacuna: Vacuna): Promise<void> {
        vacuna.stock -= cantidad;
        await this.em.flush();
        return;
    }
}