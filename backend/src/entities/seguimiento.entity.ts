import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import type { Rel } from '@mikro-orm/core';
import { Adopcion } from './adopcion.entity.js';

@Entity()
export class Seguimiento {

    @PrimaryKey({ type: 'number', autoincrement: true })
    id_seguimiento!: number;

    @Property({ type: 'date' })
    fecha_seguimiento!: Date;

    @Property({ type: 'string', length: 30 })
    estado_animal!: string;

    @Property({ type: 'string', length: 255, nullable: false })
    entorno!: string;

    @ManyToOne(() => Adopcion, { joinColumn: 'nro_adopcion' })
    adopcion!: Rel<Adopcion>;

}