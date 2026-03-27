import { Animal } from "../entities/animal.entity.js";
import { AnimalRepository } from "./animal.repository.js";
import { EntityManager } from "@mikro-orm/core";
import { AnimalDTO } from "./animalDTO.js";

export class AnimalRepositoryORM implements AnimalRepository {
    constructor(private readonly em:EntityManager){};

    async findAll(): Promise<Animal[]> {
        return await this.em.find(Animal, {});
    };

    async getOne(numero:number):Promise<Animal>{
        return await this.em.findOneOrFail(Animal, {numero});
    };

    async create(animal:Animal):Promise<Animal>{
        this.em.persist(animal);
        await this.em.flush();
        return animal;
    };
    
    async update(animal:Animal, dto:Partial<Animal>):Promise<Animal>{
        this.em.assign(animal, dto);
        await this.em.flush();
        return animal;
    };

    async delete(numero:number):Promise<void>{
        const animal = await this.em.findOne(Animal, {numero});
        if (animal) {
            this.em.remove(animal);
            await this.em.flush();
        }
    }
}