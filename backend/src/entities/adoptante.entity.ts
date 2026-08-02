import { Entity, PrimaryKey, Property, OneToMany, OneToOne } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Persona } from './persona.entity.js';
import { Adopcion } from './adopcion.entity.js';
import { Entrevista } from './entrevista.entity.js';

@Entity()
export class Adoptante {

    @PrimaryKey({type: 'number', autoincrement: true })
    id_adoptante!: number;

    @OneToOne(() => Persona, { joinColumn: 'dni_persona' })
    persona!: Persona;

    @Property({ type: 'string', length: 20 })
    estado!: string;
    
    @OneToMany(() => Adopcion, adopcion => adopcion.adoptante)
    adopciones = new Collection<Adopcion>(this);

    @OneToMany(() => Entrevista, entrevista => entrevista.adoptante)
    entrevistas = new Collection<Entrevista>(this);
}