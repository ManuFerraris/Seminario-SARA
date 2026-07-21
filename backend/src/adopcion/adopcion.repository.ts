import { Adopcion } from "../entities/adopcion.entity.js";

export interface AdopcionRepository {
    findAll():Promise<Adopcion[]>;
    getOneAdopcion(nro_adopcion:number):Promise<Adopcion | null>;
    createAdopcion(adopcion:Adopcion):Promise<Adopcion>;
    updateAdopcion(adopcion:Adopcion, dto:Partial<Adopcion>):Promise<Adopcion>;
    delete(adopcion:Adopcion):Promise<void>;
}