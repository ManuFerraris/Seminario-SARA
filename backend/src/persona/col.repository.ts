import { Colaborador } from "../entities/colaborador.entity.js";
import { Persona } from "../entities/persona.entity.js";

export interface ColaboradorRepository {
    findAll(): Promise<Colaborador[]>;
    findOne(id_colaborador: number): Promise<Colaborador | null>;
    findByDni(id_colaborador: number): Promise<Colaborador | null>;
    findOneByPersona(persona: Persona): Promise<Colaborador | null>;
    create(colaborador: Colaborador): Promise<Colaborador>;
    update(colaborador: Colaborador, dto: Partial<Colaborador>): Promise<Colaborador>;
    delete(id_colaborador: number): Promise<void>;
};