import { Entrevista } from "../entities/entrevista.entity.js";
import { EntrevistaDTO } from "./entrevistaDTO.js";
import { EntityManager } from "@mikro-orm/core";
import { EntrevistaRepository } from "./entrevista.repository.js";
import { Adoptante } from "../entities/adoptante.entity.js";
import { Colaborador } from "../entities/colaborador.entity.js";

export class EntrevistaRepositoryORM implements EntrevistaRepository {
    constructor(private em: EntityManager){};
    
    async buscarEntrevista(adoptante: Adoptante, colaborador: Colaborador, fecha_ent: Date): Promise<Entrevista | null> {
        return await this.em.findOne(Entrevista, { adoptante: adoptante, colaborador: colaborador, fecha_hora: fecha_ent });
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

    async eliminarEntrevista(adoptante: Adoptante, colaborador: Colaborador, fecha_ent: Date): Promise<void> {
        const entrevista = await this.buscarEntrevista(adoptante, colaborador, fecha_ent);
        if (entrevista) {
            this.em.remove(entrevista);
            await this.em.flush();
        }
    }
}