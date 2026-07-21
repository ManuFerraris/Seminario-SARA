import { Colocacion } from "../entities/colocacion.entity.js";

export interface ColocacionRepository {
    findAll():Promise<Colocacion[]>;
    getOneColocacion(nro_colocacion:number):Promise<Colocacion | null>;
    createColocacion(colocacion:Colocacion):Promise<Colocacion>;
    updateColocacion(colocacion:Colocacion, dto:Partial<Colocacion>):Promise<Colocacion>;
    delete(colocacion:Colocacion):Promise<void>;
}