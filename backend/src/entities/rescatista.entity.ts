import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Rescatista {

    @PrimaryKey({ type: 'number' })
    numero!: number;

    @Property({ type: 'string', unique: true })
    dni!: string;

    @Property({ type: 'string', length: 30 })
    nombre!: string;

    @Property({ type: 'string', length: 30 })
    apellido!: string;

    @Property({ type: 'string', length: 30, nullable: true })
    telefono?: string;

}