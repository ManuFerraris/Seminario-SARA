import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Animal } from './animal.entity.js';
import { Veterinario } from './veterinario.entity.js';

@Entity()
export class FichaMedica {

    // Primera parte de la PK: la relación con Animal
    @ManyToOne(() => Animal, { primary: true, joinColumn: 'numero_animal' })
    animal!: Animal;

    // Segunda parte de la PK: la relación con Veterinario
    @ManyToOne(() => Veterinario, { primary: true, joinColumn: 'numero_veterinario' })
    veterinario!: Veterinario;

    // Tercera parte de la PK: la fecha y hora exacta
    @PrimaryKey({ type: 'datetime' })
    fecha_ficha!: Date;

    @Property({type: 'string', length: 255, nullable: true })
    observaciones?: string;

}