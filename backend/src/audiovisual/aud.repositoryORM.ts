import { EntityManager } from '@mikro-orm/core';
import { AudiovisualRepository } from './aud.repository.js';
import { Audiovisual } from '../entities/audiovisual.entity.js';

export class AudiovisualRepositoryORM implements AudiovisualRepository {
    constructor(private em: EntityManager) {}

    async findAll(): Promise<Audiovisual[]> {
        return await this.em.find(Audiovisual, {}, { populate: ['animal'] });
    };

    async getOne(numero: number): Promise<Audiovisual | null> {
        return await this.em.findOne(Audiovisual, { id_audiovisual: numero }, { populate: ['animal'] });
    };

    async findByAnimal(numero_animal: number): Promise<Audiovisual[]> {
        return await this.em.find(Audiovisual, { 
            animal: { nro_animal: numero_animal } 
        });
    };

    async create(audiovisual: Audiovisual): Promise<Audiovisual> {
        this.em.persist(audiovisual);
        await this.em.flush();
        return audiovisual;
    };

    async delete(audiovisual: Audiovisual): Promise<void> {
        this.em.remove(audiovisual);
        await this.em.flush();
    };
}