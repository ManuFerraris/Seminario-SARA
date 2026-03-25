import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Persona {

    @PrimaryKey()
    numero!: number;

    @Property({ length: 9, unique: true })
    dni!: string;

    @Property({ length: 30 })
    nombre!: string;

    @Property({ length: 30 })
    apellido!: string;

    @Property({ length: 50, unique: true })
    email!: string;

    @Property({ length: 255 })
    contrasenia!: string;

    @Property({ length: 30, nullable: true })
    telefono?: string;
}