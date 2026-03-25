import { Entity, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { Persona } from './persona.entity';

@Entity()
export class Adoptante {

    @OneToOne(() => Persona, { primary: true, joinColumn: 'numero_persona' })
    persona!: Persona;

    @Property({ length: 15 })
    estado!: string;

    @Property({ length: 50 })
    domicilio!: string;
}