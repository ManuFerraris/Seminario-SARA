import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Rescate } from './rescate.entity.js';
import { Donacion } from './donacion.entity.js';
import { Adopcion } from './adopcion.entity.js';
import { Entrevista } from './entrevista.entity.js';

@Entity()
export class Persona {

    @PrimaryKey({ type: 'string', length: 20, unique: true })
    dni!: string;

    @Property({ type: 'string', length: 30, nullable: true })
    matricula?: string;

    @Property({ type: 'number', nullable: true })
    anios_experiencia?: number;

    @Property({ type: 'string', length: 10, nullable: true })
    id_colaborador?: string;

    @Property({ type: 'string', length: 10, nullable: true })
    id_adoptante?: string;

    @Property({ type: 'string', length: 20, nullable: true })
    estado?: string;

    @Property({ type: 'string', length: 100, nullable: true })
    domicilio?: string;

    @Property({ type: 'string', length: 30 })
    nombre!: string;

    @Property({ type: 'string', length: 30 })
    apellido!: string;

    @Property({ type: 'string', length: 50, unique: true })
    email!: string;

    @Property({ type: 'string', length: 255 })
    contrasenia!: string;

    @Property({ type: 'string', length: 30, nullable: true })
    telefono?: string;

    @OneToMany(() => Donacion, (donacion) => donacion.persona)
    donaciones = new Collection<Donacion>(this);

    @OneToMany(() => Rescate, (rescate) => rescate.persona)
    rescates = new Collection<Rescate>(this);

    @OneToMany(() => Adopcion, (adopcion) => adopcion.adoptante)
    adopciones = new Collection<Adopcion>(this);

    // Entrevistas donde esta persona es el adoptante
    @OneToMany(() => Entrevista, (entrevista) => entrevista.adoptante)
    entrevistasComoAdoptante = new Collection<Entrevista>(this);

    // Entrevistas donde esta persona es el colaborador (entrevistador)
    @OneToMany(() => Entrevista, (entrevista) => entrevista.colaborador)
    entrevistasComoColaborador = new Collection<Entrevista>(this);
}