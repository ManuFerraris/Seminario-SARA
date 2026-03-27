import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Animal } from './animal.entity.js';

@Entity()
export class Audiovisual {

    // Primera parte de la PK: la dependencia fuerte con el Animal
    @ManyToOne(() => Animal, { primary: true, joinColumn: 'numero_animal' })
    animal!: Animal;

    // Segunda parte de la PK: el identificador interno del material para ese animal
    @PrimaryKey({ type: 'number' })
    numero!: number;

    @Property({ type: 'string', length: 255 })
    url_material!: string;

    @Property({ type: 'string',  length: 255, nullable: true })
    descripcion?: string;

}