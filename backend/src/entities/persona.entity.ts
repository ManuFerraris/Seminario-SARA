import { Entity, PrimaryKey, Property, OneToMany, OneToOne } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import type { Rel } from '@mikro-orm/core';
import { Rescate } from './rescate.entity.js';
import { Donacion } from './donacion.entity.js';
import { Veterinario } from './veterinario.entity.js';
import { Colaborador } from './colaborador.entity.js';
import { Adoptante } from './adoptante.entity.js';

@Entity()
export class Persona {

    @PrimaryKey({ type: 'string', length: 20, unique: true })
    dni!: string;

    @Property({ type: 'string', length: 30 })
    nombre!: string;

    @Property({ type: 'string', length: 30 })
    apellido!: string;

    @Property({ type: 'string', length: 50, unique: true })
    email!: string;

    @Property({ type: 'string', length: 255 })
    contrasenia!: string;

    @Property({ type: 'string', length: 30, nullable: true })
    telefono!: string;

    @Property({ type: 'string', length: 100, nullable: true })
    domicilio!: string;

    @OneToMany(() => Donacion, (donacion) => donacion.persona)
    donaciones = new Collection<Donacion>(this);

    @OneToMany(() => Rescate, (rescate) => rescate.persona)
    rescates = new Collection<Rescate>(this);

    @OneToOne(() => Veterinario, (veterinario) => veterinario.persona, { nullable: true })
    veterinario?: Rel<Veterinario>;

    @OneToOne(() => Colaborador, (colaborador) => colaborador.persona, { nullable: true })
    colaborador?: Rel<Colaborador>;

    @OneToOne(() => Adoptante, (adoptante) => adoptante.persona, { nullable: true })
    adoptante?: Rel<Adoptante>;
}