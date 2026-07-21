import { Entrevista } from "../entities/entrevista.entity.js";
import { EntityManager } from "@mikro-orm/core";
import { EntrevistaRepository } from "./entrevista.repository.js";

export class EntrevistaRepositoryORM implements EntrevistaRepository {
    constructor(private em: EntityManager){};
    
    async buscarEntrevista(nro_entrevista: number): Promise<Entrevista | null> {
        return await this.em.findOne(Entrevista, { id_entrevista: nro_entrevista });
    };

    async traerTodasEntrevistas(): Promise<Entrevista[]> {
        return await this.em.findAll(Entrevista);
    }

    async crearEntrevista(entrevista: Entrevista): Promise<Entrevista> {
        const nuevaEntrevista = this.em.create(Entrevista, entrevista);
        this.em.persist(nuevaEntrevista);
        await this.em.flush();
        return nuevaEntrevista;
    }

    async actualizarEntrevista(entrevista: Entrevista): Promise<Entrevista> {
        await this.em.flush();
        return entrevista;
    }

    async eliminarEntrevista(nro_entrevista: number): Promise<void> {
        const entrevista = await this.buscarEntrevista(nro_entrevista);
        if (entrevista) {
            this.em.remove(entrevista);
            await this.em.flush();
        }
    }
}