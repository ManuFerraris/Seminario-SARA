import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Persona {

    @PrimaryKey({ type: 'number' })
    numero!: number;

    @Property({ type: 'string', length: 9, unique: true })
    dni!: string;

    @Property({ type: 'string', length: 30 })
    nombre!: string;

    @Property({ type: 'string',  length: 30 })
    apellido!: string;

    @Property({ type: 'string', length: 50, unique: true })
    email!: string;

    @Property({ type: 'string', length: 255 })
    contrasenia!: string;

    @Property({ type: 'string', length: 30, nullable: true })
    telefono?: string;
}