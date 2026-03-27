import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Adoptante } from './adoptante.entity.js';
import { Colaborador } from './colaborador.entity.js';

@Entity()
export class Entrevista {

    // Primera parte de la Clave Primaria Compuesta
    @ManyToOne(() => Adoptante, { primary: true, joinColumn: 'numero_adoptante' })
    adoptante!: Adoptante;

    // Segunda parte de la Clave Primaria Compuesta
    @ManyToOne(() => Colaborador, { primary: true, joinColumn: 'numero_colaborador' })
    colaborador!: Colaborador;

    // Tercera parte de la Clave Primaria Compuesta
    @PrimaryKey({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({ type: 'datetime' })
    fecha_hora_rep!: Date;

    @Property({type: 'string', length: 15 })
    estado!: string;

    @Property({type: 'string', length: 255, nullable: true })
    descripcion?: string;

    @Property({ type: 'boolean', default: false })
    aprobada!: boolean;

}