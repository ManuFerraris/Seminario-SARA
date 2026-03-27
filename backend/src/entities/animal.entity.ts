import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Animal {

    @PrimaryKey({ type: 'number' })
    numero!: number;

    @Property({ length: 20, type: 'string' })
    especie!: string;

    @Property({ length: 20, type: 'string' })
    raza!: string;

    @Property({ type: 'number' })
    edad_estimada!: number;

    @Property({ type: 'date' })
    fecha_ingreso!: Date;

    @Property({ type: 'date', nullable: true })
    fecha_defuncion?: Date;

    @Property({ length: 20, type: 'string' })
    estado!: string;

    @Property({ length: 9, type: 'string' })
    sexo!: string;

    @Property({ columnType: 'decimal(10,2)', type: 'number' })
    peso!: number;

    @Property({ length: 255, type: 'string' })
    descripcion!: string;
}