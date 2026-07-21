import { Seguimiento } from '../entities/seguimiento.entity.js';

export interface SeguimientoRepository {
    getAll(): Promise<Seguimiento[]>;
    getOne(id_seguimiento: number): Promise<Seguimiento | null>;
    createSeguimiento(seguimiento: Seguimiento): Promise<void>;
    updateSeguimiento(seguimiento: Seguimiento, datosActualizados: Partial<Seguimiento>): Promise<void>;
    deleteSeguimiento(seguimiento: Seguimiento): Promise<void>;
} 