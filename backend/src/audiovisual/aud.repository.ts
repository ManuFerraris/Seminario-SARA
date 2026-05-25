import { Audiovisual } from '../entities/audiovisual.entity.js';

export interface AudiovisualRepository {
    findAll(): Promise<Audiovisual[]>;
    getOne(numero: number): Promise<Audiovisual | null>;
    // Método clave para traer la galería completa de un solo animal
    findByAnimal(numero_animal: number): Promise<Audiovisual[]>;
    create(audiovisual: Audiovisual): Promise<Audiovisual>;
    delete(audiovisual: Audiovisual): Promise<void>;
}