import { Animal } from "../entities/animal.entity.js";

export interface AnimalRepository {
    findAll():Promise<Animal[]>;
    getOne(numero:number):Promise<Animal | undefined>;
    create(animal:Animal):Promise<Animal>;
    update(animal:Animal, dto:Partial<Animal>):Promise<Animal>;
    delete(numero:number):Promise<void>;
}