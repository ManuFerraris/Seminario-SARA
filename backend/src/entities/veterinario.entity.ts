import { Entity, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { Persona } from './persona.entity.js';

@Entity()
export class Veterinario {

    @OneToOne(() => Persona, { primary: true, joinColumn: 'numero_persona' })
    persona!: Persona;

    @Property({ type: 'string', length: 15, unique: true })
    matricula!: string;

    @Property({ type: 'number' })
    anio_experiencia!: number;
}