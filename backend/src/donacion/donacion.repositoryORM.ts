import { Donacion } from "../entities/donacion.entity.js";
import { DonacionDTO } from "./donacionDTO.js";
import { EntityManager } from "@mikro-orm/core";
import { DonacionRepository } from "./donacion.reposiroty.js";

export class DonacionRepositoryORM implements DonacionRepository {
    constructor(private em: EntityManager){};

    async buscarDonacionPorNumero(numero: number): Promise<Donacion | null> {
        return await this.em.findOne(Donacion, { numero });
    };

    async traerTodasDonaciones(): Promise<Donacion[]> {
        return await this.em.find(Donacion, {});
    };

    async crearDonacion(donacion: Donacion): Promise<Donacion> {
        this.em.persist(donacion);
        return this.em.flush().then(() => donacion);
    };

    async actualizarDonacion(donacion: Donacion, dto:DonacionDTO): Promise<Donacion> {
        this.em.assign(donacion, dto);
        await this.em.flush();
        return donacion;
    };

    async eliminarDonacion(numero: number): Promise<void> {
        const donacionExistente = await this.em.findOne(Donacion, { numero });
        if (!donacionExistente) return;
        this.em.remove(donacionExistente);
        await this.em.flush();
    }
}