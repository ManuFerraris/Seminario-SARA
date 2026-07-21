import { FichaMedica } from '../entities/ficha-medica.entity.js';

export interface FichaMedicaRepository {
    findAll(): Promise<FichaMedica[]>;
    getOneFichaMedica(nro_ficha_medica: number): Promise<FichaMedica | null>;
    createFichaMedica(fichaMedica: FichaMedica): Promise<FichaMedica>;
    updateFichaMedica(fichaMedica: FichaMedica, dto: Partial<FichaMedica>): Promise<FichaMedica>;
    delete(fichaMedica: FichaMedica): Promise<void>;
}