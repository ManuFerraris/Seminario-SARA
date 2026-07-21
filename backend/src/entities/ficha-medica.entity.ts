import { Entity, PrimaryKey, Property, ManyToOne, OneToOne, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection, type Rel } from '@mikro-orm/core';
import { Animal } from './animal.entity.js';
import { Persona } from './persona.entity.js';
import { Colocacion } from './colocacion.entity.js';

@Entity()
export class FichaMedica {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_ficha!: number;

    @ManyToOne(() => Animal, { joinColumn: 'nro_animal' })
    animal!: Rel<Animal>;

    @ManyToOne(() => Persona, { joinColumn: 'dni_veterinario' })
    persona!: Rel<Persona>;

    @Property({ type: 'date' })
    fecha!: Date;

    @Property({ type: 'varchar', length: 255, nullable: true })
    observaciones?: string;

    @OneToMany(() => Colocacion, colocacion => colocacion.ficha)
    colocaciones = new Collection<Colocacion>(this);

}