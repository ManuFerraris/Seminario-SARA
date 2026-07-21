import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Adopcion } from './adopcion.entity.js';
import { FichaMedica } from './ficha-medica.entity.js';
import { Audiovisual } from './audiovisual.entity.js';
import { Rescate } from './rescate.entity.js';
import { Collection } from '@mikro-orm/core';

@Entity()
export class Animal {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_animal!: number;

    @Property({ length: 50, type: 'string' })
    especie!: string;

    @Property({ length: 50, type: 'string' })
    raza!: string;

    @Property({ type: 'number' })
    edad_estimada!: number;

    @Property({ type: 'date' })
    fecha_ingreso!: Date;

    @Property({ type: 'date', nullable: true })
    fecha_defuncion?: Date;

    @Property({ length: 20, type: 'string' })
    estado!: string;

    @Property({ length: 9, type: 'string' })
    sexo!: string;

    @Property({ columnType: 'decimal(10,2)', type: 'number' })
    peso!: number;

    @Property({ length: 255, type: 'string', nullable: true })
    descripcion?: string;

    // Relación bidireccional: Un animal puede tener muchas fichas médicas
    @OneToMany(() => FichaMedica, ficha => ficha.animal)
    fichas_medicas = new Collection<FichaMedica>(this);

    // Relación bidireccional: Un animal puede tener muchos materiales audiovisuales
    @OneToMany(() => Audiovisual, audiovisual => audiovisual.animal)
    audiovisuales = new Collection<Audiovisual>(this);

    // Relación bidireccional: Un animal puede tener muchas adopciones
    @OneToMany(() => Adopcion, adopcion => adopcion.animal)
    adopciones = new Collection<Adopcion>(this);

    // Relación bidireccional: Un animal puede tener muchos rescates
    @OneToMany(() => Rescate, rescate => rescate.animal)
    rescates = new Collection<Rescate>(this);
}