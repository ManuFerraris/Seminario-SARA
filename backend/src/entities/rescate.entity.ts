import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import type { Rel } from '@mikro-orm/core';
import { Persona } from './persona.entity.js';
import { Animal } from './animal.entity.js';

@Entity()
export class Rescate {

    // Primera parte de la PK: la relación con el Persona.
    // joinColumn fuerza el nombre 'numero_persona'
    @ManyToOne(() => Persona, { primary: true, joinColumn: 'numero_persona' })
    persona!: Rel<Persona>;

    // Segunda parte de la PK: la relación con el Animal
    @ManyToOne(() => Animal, { primary: true, joinColumn: 'numero_animal' })
    animal!: Rel<Animal>;

    // Tercera parte de la PK: la fecha y hora
    @PrimaryKey({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({type: 'string', length: 255 })
    lugar_rescate!: string;
}