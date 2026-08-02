import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { Colaborador } from './colaborador.entity.js';
import { Adoptante } from './adoptante.entity.js';
import { Animal } from './animal.entity.js';

@Entity()
export class Entrevista {

    @PrimaryKey({ type: 'number', autoincrement: true })
    id_entrevista!: number;

    @ManyToOne(() => Colaborador, { joinColumn: 'id_colaborador' })
    colaborador?: Rel<Colaborador>;

    @ManyToOne(() => Adoptante, { joinColumn: 'id_adoptante' })
    adoptante!: Rel<Adoptante>;

    @ManyToOne(() => Animal, { joinColumn: 'nro_animal' })
    animal!: Rel<Animal>;

    @Property({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({ type: 'datetime', nullable: true })
    fecha_hora_rep?: Date | null;

    @Property({ type: 'string', length: 20 })
    estado!: string;

    @Property({ type: 'string', length: 255, nullable: true })
    descripcion?: string;

}