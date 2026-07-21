import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Colocacion } from './colocacion.entity.js';

@Entity()
export class Vacuna {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_vacuna!: number;

    @Property({ type: 'date' })
    fecha_vencimiento!: Date;

    @Property({ type: 'string', length: 255 })
    droga!: string;

    @Property({ type: 'number' })
    stock!: number;

    @Property({ type: 'date' })
    fecha_ingreso!: Date;

    // Relación bidireccional: Una vacuna del catálogo tiene muchas colocaciones
    @OneToMany(() => Colocacion, colocacion => colocacion.vacuna)
    colocaciones = new Collection<Colocacion>(this);

}