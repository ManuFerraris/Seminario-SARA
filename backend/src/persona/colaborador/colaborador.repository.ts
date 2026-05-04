import { Colaborador } from "../../entities/colaborador.entity.js";

export interface ColaboradorRepository {
    findAll(): Promise<Colaborador[]>;
    findOne(numero_colaborador: string): Promise<Colaborador | null>;
    create(colaborador: Colaborador): Promise<Colaborador>;
    update(colaborador: Colaborador, dto: Partial<Colaborador>): Promise<Colaborador>;
    delete(numero_colaborador: string): Promise<void>;
}