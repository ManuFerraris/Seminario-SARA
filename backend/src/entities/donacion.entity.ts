import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Donacion {

    @PrimaryKey({ type: 'number' })
    numero!: number;

    @Property({ type: 'string', length: 20 })
    tipo!: string;

    @Property({ type: 'number',  nullable: true })
    cantidad?: number;

    @Property({ type: 'string', length: 255, nullable: true })
    descripcion?: string;

    @Property({ type: 'date' })
    fecha_vencimiento!: Date;

}