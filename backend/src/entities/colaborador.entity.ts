import { Entity, PrimaryKey, Property, OneToMany, OneToOne } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Rel } from '@mikro-orm/core';
import { Persona } from './persona.entity.js';
import { Entrevista } from './entrevista.entity.js';

@Entity()
export class Colaborador {

    @PrimaryKey({type: 'number', autoincrement: true })
    id_colaborador!: number;

    @OneToOne(() => Persona, { joinColumn: 'dni_persona' })
    persona!: Rel<Persona>;

    @OneToMany(() => Entrevista, entrevista => entrevista.colaborador)
    entrevistas = new Collection<Entrevista>(this);
}
