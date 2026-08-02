import { Animal } from "../entities/animal.entity.js";
import { AnimalRepository } from "./animal.repository.js";
import { EntityManager } from "@mikro-orm/core";

export class AnimalRepositoryORM implements AnimalRepository {
    constructor(private readonly em:EntityManager){};

    async findAll(): Promise<Animal[]> {
        return await this.em.find(Animal, {});
    };

    async getOne(numero:number):Promise<Animal | null>{
        return await this.em.findOne(Animal, {nro_animal: numero}, {populate: ['fichas_medicas', 'fichas_medicas.colocaciones']});
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
        const animal = await this.em.findOne(Animal, {nro_animal: numero});
        if (animal) {
            this.em.remove(animal);
            await this.em.flush();
        }
    }

    async cambiarEstadoDisponible(animal:Animal):Promise<null>{
        animal.estado = "Disponible";
        await this.em.flush();
        return null;
    }

    async cambiarEstadoFallecido(animal:Animal, dto:Partial<Animal>):Promise<null>{
        animal.estado = "Fallecido";
        animal.fecha_defuncion = dto.fecha_defuncion;
        await this.em.flush();
        return null;
    }

    async obtenerFichasMedicas(numero_animal:number):Promise<Animal | null>{
        return await this.em.findOne(Animal, {nro_animal: numero_animal}, {populate: ['fichas_medicas', 'fichas_medicas.colocaciones']});
    }
};