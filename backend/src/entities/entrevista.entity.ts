import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { Persona } from './persona.entity.js';

@Entity()
export class Entrevista {

    // ID subrogado puro
    @PrimaryKey({ type: 'number', autoincrement: true })
    id_entrevista!: number;

    // Relación N a 1: Muchas entrevistas pueden ser realizadas por un mismo colaborador
    @ManyToOne(() => Persona, { joinColumn: 'dni_colaborador' })
    colaborador!: Rel<Persona>;

    // Relación N a 1: Muchas entrevistas pueden tener al mismo adoptante (si aplicó varias veces)
    @ManyToOne(() => Persona, { joinColumn: 'dni_adoptante' })
    adoptante!: Rel<Persona>;

    @Property({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({ type: 'datetime' })
    fecha_hora_rep!: Date;

    @Property({ type: 'string', length: 20 })
    estado!: string;

    @Property({ type: 'string', length: 255, nullable: true })
    descripcion?: string;

    @Property({ type: 'boolean', default: false })
    aprobada!: boolean;

}