import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Animal {

    @PrimaryKey()
    numero!: number;

    @Property({ length: 20 })
    especie!: string;

    @Property({ length: 20 })
    raza!: string;

    @Property()
    edad_estimada!: number;

    @Property({ type: 'date' })
    fecha_ingreso!: Date;

    @Property({ type: 'date', nullable: true })
    fecha_defuncion?: Date;

    @Property({ length: 20 })
    estado!: string;
}