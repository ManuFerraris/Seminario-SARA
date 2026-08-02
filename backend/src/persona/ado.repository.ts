import { Adoptante } from "../entities/adoptante.entity.js";
import { Persona } from "../entities/persona.entity.js";

export interface AdoptanteRepository {
    findAll(): Promise<Adoptante[]>;
    findOne(id_adoptante: number): Promise<Adoptante | null>;
    findByDni(id_adoptante: number): Promise<Adoptante | null>;
    findOneByPersona(persona: Persona): Promise<Adoptante | null>;
    create(adoptante: Adoptante): Promise<Adoptante>;
    update(adoptante: Adoptante, dto: Partial<Adoptante>): Promise<Adoptante>;
    delete(id_adoptante: number): Promise<void>;
};