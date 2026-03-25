import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Donacion {

    @PrimaryKey()
    numero!: number;

    @Property({ length: 20 })
    tipo!: string;

    @Property({ nullable: true })
    cantidad?: number;

    @Property({ length: 255, nullable: true })
    descripcion?: string;

    @Property({ type: 'date' })
    fecha_vencimiento!: Date;

}