import { Entity, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { Persona } from './persona.entity.js';

@Entity()
export class Colaborador {

    @OneToOne(() => Persona, { primary: true, joinColumn: 'numero_persona' })
    persona!: Persona;

    @Property({type: 'string', length: 10, unique: true })
    id!: string;
}