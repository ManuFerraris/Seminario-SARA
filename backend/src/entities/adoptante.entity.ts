import { Entity, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { Persona } from './persona.entity.js';

@Entity()
export class Adoptante {

    @OneToOne(() => Persona, { primary: true, joinColumn: 'numero_persona' })
    persona!: Persona;

    @Property({type: 'string', length: 15 })
    estado!: string;

    @Property({type: 'string', length: 50 })
    domicilio!: string;
}