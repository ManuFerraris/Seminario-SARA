import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import type { Rel } from '@mikro-orm/core';
import { Persona } from './persona.entity.js';
import { Animal } from './animal.entity.js';

@Entity()
export class Rescate {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_rescate!: number;

    @ManyToOne(() => Animal, { joinColumn: 'nro_animal' })
    animal!: Rel<Animal>;

    @ManyToOne(() => Persona, { joinColumn: 'dni_persona' })
    persona!: Rel<Persona>;

    @Property({type: 'string', length: 255 })
    lugar_rescate!: string;

    @Property({type: 'date' })
    fecha_rescate!: Date;

}