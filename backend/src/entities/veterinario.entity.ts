import { Entity, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { Persona } from './persona.entity';

@Entity()
export class Veterinario {

    @OneToOne(() => Persona, { primary: true, joinColumn: 'numero_persona' })
    persona!: Persona;

    @Property({ length: 15, unique: true })
    matricula!: string;

    @Property()
    anio_experiencia!: number;
}