import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Persona } from './persona.entity.js';
import { Rel } from '@mikro-orm/core';

@Entity()
export class Donacion {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_donacion!: number;

    @Property({ type: 'string', length: 30 })
    tipo!: string;

    @Property({ type: 'number',  nullable: false })
    cantidad!: number;

    @Property({ type: 'string', length: 255, nullable: true })
    descripcion?: string;

    @Property({ type: 'date', nullable: true })
    fecha_vencimiento?: Date;

    @ManyToOne(() => Persona, { joinColumn: 'dni_donante' })
    persona!: Rel<Persona>;
}