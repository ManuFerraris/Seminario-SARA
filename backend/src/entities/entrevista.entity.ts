import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Adoptante } from './adoptante.entity';
import { Colaborador } from './colaborador.entity';

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

    @Property({ length: 15 })
    estado!: string;

    @Property({ length: 255, nullable: true })
    descripcion?: string;

    @Property({ default: false })
    aprobada!: boolean;

}