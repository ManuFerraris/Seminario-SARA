import { Adopcion } from "../entities/adopcion.entity.js";
import { Animal } from "../entities/animal.entity.js";
import { Adoptante } from "../entities/adoptante.entity.js";

export interface AdopcionRepository {
    findAll():Promise<Adopcion[]>;
    getOneAdopcion(nro_adopcion:number):Promise<Adopcion | null>;
    createAdopcion(adopcion:Adopcion):Promise<Adopcion>;
    updateAdopcion(adopcion:Adopcion, dto:Partial<Adopcion>):Promise<Adopcion>;
    delete(adopcion:Adopcion):Promise<void>;
    findByAnimalAndAdoptante(animal: Animal, adoptante: Adoptante): Promise<Adopcion | null>;
}