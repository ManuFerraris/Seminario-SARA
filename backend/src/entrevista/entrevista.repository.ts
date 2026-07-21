import { Entrevista } from "../entities/entrevista.entity.js";
import {Persona} from "../entities/persona.entity.js";

export interface EntrevistaRepository {
    buscarEntrevista(nro_entrevista: number): Promise<Entrevista | null>;
    traerTodasEntrevistas(): Promise<Entrevista[]>;
    crearEntrevista(entrevista: Entrevista): Promise<Entrevista>;
    actualizarEntrevista(entrevista:Entrevista): Promise<Entrevista>;
    eliminarEntrevista(nro_entrevista: number): Promise<void>;
}