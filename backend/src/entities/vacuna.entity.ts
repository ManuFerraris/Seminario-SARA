import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Vacuna {

    @PrimaryKey()
    numero!: number;

    @Property({ type: 'date' })
    fecha_vencimiento!: Date;

    @Property({ length: 255 })
    droga!: string;

    @Property()
    stock!: number;

    @Property({ type: 'date' })
    fecha_ingreso!: Date;

}