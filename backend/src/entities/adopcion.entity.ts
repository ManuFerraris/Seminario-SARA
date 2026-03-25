import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Adoptante } from './adoptante.entity';
import { Animal } from './animal.entity';

@Entity()
export class Adopcion {

    @ManyToOne(() => Adoptante, { primary: true, joinColumn: 'numero_adoptante' })
    adoptante!: Adoptante;

    @ManyToOne(() => Animal, { primary: true, joinColumn: 'numero_animal' })
    animal!: Animal;

    @Property({ type: 'date' })
    fecha_adopcion!: Date;

    @Property({ type: 'date', nullable: true })
    fecha_retiro?: Date;

    @Property({ length: 255, nullable: true })
    motivos_retiro?: string;

    @Property({ length: 255, nullable: true })
    evidencia_maltrato?: string;

}