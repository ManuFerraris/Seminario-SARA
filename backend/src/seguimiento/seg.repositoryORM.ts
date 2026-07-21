import { Seguimiento } from '../entities/seguimiento.entity';
import { SeguimientoRepository } from './seg.repository';
import { EntityManager } from '@mikro-orm/core';

export class SeguimientoRepositoryORM implements SeguimientoRepository {
    constructor(private readonly ormRepository: EntityManager) {}

    async getAll(): Promise<Seguimiento[]> {
        return this.ormRepository.find(Seguimiento, {});
    };

    async getOne(id_seguimiento: number): Promise<Seguimiento | null> {
        return this.ormRepository.findOne(Seguimiento, { id_seguimiento });
    };

    async createSeguimiento(seguimiento: Seguimiento): Promise<void> {
        this.ormRepository.persist(seguimiento);
        await this.ormRepository.flush();
        return;
    };

    async updateSeguimiento(seguimiento: Seguimiento, datosActualizados: Partial<Seguimiento>): Promise<void> {
        Object.assign(seguimiento, datosActualizados);
        this.ormRepository.persist(seguimiento);
        await this.ormRepository.flush();
        return;
    };

    async deleteSeguimiento(seguimiento: Seguimiento): Promise<void> {
        this.ormRepository.remove(seguimiento);
        await this.ormRepository.flush();
    }
};