import { Entity, PrimaryKey, Property, OneToMany, OneToOne } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Rel } from '@mikro-orm/core';
import { Persona } from './persona.entity.js';
import { FichaMedica } from './ficha-medica.entity.js';

@Entity()
export class Veterinario {
    
    @PrimaryKey({ type: 'string', length: 30 })
    matricula!: string;

    @Property({ type: 'number' })
    anios_experiencia!: number;

    @OneToOne(() => Persona, { joinColumn: 'dni_persona' })
    persona!: Rel<Persona>;

    @OneToMany(() => FichaMedica, fichaMedica => fichaMedica.veterinario)
    fichasMedicas = new Collection<FichaMedica>(this);
}