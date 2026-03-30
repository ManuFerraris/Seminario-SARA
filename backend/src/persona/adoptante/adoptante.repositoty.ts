import { Adoptante } from "../../entities/adoptante.entity.js";

export interface AdoptanteRepository {
    findAll(): Promise<Adoptante[]>;
    findOne(numero_persona: number): Promise<Adoptante | null>;
    create(adoptante: Adoptante): Promise<Adoptante>;
    update(adoptante: Adoptante, dto: Partial<Adoptante>): Promise<Adoptante>;
    delete(numero_persona: number): Promise<void>;
};