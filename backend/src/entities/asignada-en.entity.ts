import { Entity, PrimaryKey, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Vacuna } from './vacuna.entity.js';
import { FichaMedica } from './ficha-medica.entity.js';

@Entity()
export class AsignadaEn {

    // Primera parte de la PK: la relación simple con Vacuna
    @ManyToOne(() => Vacuna, { primary: true, joinColumn: 'numero_vacuna' })
    vacuna!: Vacuna;

    // Segunda, tercera y cuarta parte de la PK: la relación compleja con FichaMedica.
    // Es VITAL que el orden en el arreglo 'joinColumns' coincida exactamente 
    // con cómo están definidas las Primary Keys dentro de tu clase FichaMedica.
    @ManyToOne(() => FichaMedica, { 
        primary: true, 
        joinColumns: ['numero_animal', 'numero_veterinario', 'fecha_ficha'] 
    })
    fichaMedica!: FichaMedica;

    // Quinta y última parte de la PK: la fecha de uso de esa vacuna
    @PrimaryKey({ type: 'date' })
    fecha_uso!: Date;
}