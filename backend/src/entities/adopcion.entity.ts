import { Entity, Property, PrimaryKey, ManyToOne, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import type { Rel } from '@mikro-orm/core';
import { Adoptante } from './adoptante.entity.js';
import { Animal } from './animal.entity.js';
import { Seguimiento } from './seguimiento.entity.js';

@Entity()
export class Adopcion {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_adopcion!: number;

    @ManyToOne(() => Adoptante, { joinColumn: 'id_adoptante' })
    adoptante!: Rel<Adoptante>;

    @ManyToOne(() => Animal, { joinColumn: 'nro_animal' })
    animal!: Rel<Animal>;

    @Property({ type: 'date' })
    fecha_adopcion!: Date;

    @Property({ type: 'date', nullable: true })
    fecha_retiro?: Date;

    @Property({ type: 'string', length: 255, nullable: true })
    motivos_retiro?: string;

    @Property({ type: 'string', length: 255, nullable: true })
    evidencia_maltrato?: string;

    @OneToMany(() => Seguimiento, seguimiento => seguimiento.adopcion)
    seguimientos = new Collection<Seguimiento>(this);

}