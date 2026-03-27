import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Vacuna {

    @PrimaryKey({ type: 'number' })
    numero!: number;

    @Property({ type: 'date' })
    fecha_vencimiento!: Date;

    @Property({ type: 'string', length: 255 })
    droga!: string;

    @Property({ type: 'number' })
    stock!: number;

    @Property({ type: 'date' })
    fecha_ingreso!: Date;

}