import { Entrevista } from "../entities/entrevista.entity.js";
import { Adoptante } from "../entities/adoptante.entity.js";
import { Colaborador } from "../entities/colaborador.entity.js";
import { EntrevistaDTO } from "./entrevistaDTO.js";

export interface EntrevistaRepository {
    buscarEntrevista(adoptante: Adoptante,
        colaborador: Colaborador,
        fecha_ent: Date): Promise<Entrevista | null>;
    traerTodasEntrevistas(): Promise<Entrevista[]>;
    crearEntrevista(entrevista: Entrevista): Promise<Entrevista>;
    actualizarEntrevista(entrevista:Entrevista, dto: EntrevistaDTO): Promise<Entrevista>;
    eliminarEntrevista(adoptante: Adoptante,
        colaborador: Colaborador,
        fecha_ent: Date): Promise<void>;
}