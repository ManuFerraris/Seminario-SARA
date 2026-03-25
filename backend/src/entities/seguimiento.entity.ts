import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Adopcion } from './adopcion.entity';

@Entity()
export class Seguimiento {

    // Al indicar primary: true, esta relación forma parte de la Clave Primaria.
    // Usamos joinColumns (en plural) pasándole el arreglo exacto de las columnas de la FK.
    @ManyToOne(() => Adopcion, { 
        primary: true, 
        joinColumns: ['numero_adoptante', 'numero_animal'] 
    })
    adopcion!: Adopcion;

    // El tercer pilar de nuestra Clave Primaria compuesta
    @PrimaryKey({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({ length: 20 })
    estado_animal!: string;

    @Property({ length: 255, nullable: true })
    entorno?: string;

}