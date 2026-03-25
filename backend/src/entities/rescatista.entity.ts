import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Rescatista {

    @PrimaryKey()
    numero!: number;

    @Property({ unique: true })
    dni!: number;

    @Property({ length: 30 })
    nombre!: string;

    @Property({ length: 30 })
    apellido!: string;

    @Property({ length: 30, nullable: true })
    telefono?: string;

}