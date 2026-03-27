import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Rescatista } from './rescatista.entity.js';
import { Animal } from './animal.entity.js';

@Entity()
export class Rescate {

    // Primera parte de la PK: la relación con el Rescatista.
    // joinColumn fuerza el nombre 'numero_persona'
    @ManyToOne(() => Rescatista, { primary: true, joinColumn: 'numero_persona' })
    rescatista!: Rescatista;

    // Segunda parte de la PK: la relación con el Animal
    @ManyToOne(() => Animal, { primary: true, joinColumn: 'numero_animal' })
    animal!: Animal;

    // Tercera parte de la PK: la fecha y hora
    @PrimaryKey({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({type: 'string', length: 255 })
    lugar_rescate!: string;

}