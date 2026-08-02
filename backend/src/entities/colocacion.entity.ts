import { Entity, PrimaryKey, OneToOne, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import type { Rel } from '@mikro-orm/core';
import { FichaMedica } from './ficha-medica.entity.js';
import { Vacuna } from './vacuna.entity.js';

@Entity()
export class Colocacion {

    @PrimaryKey({ type: 'number', autoincrement: true })
    nro_colocacion!: number;
    
    @ManyToOne(() => FichaMedica, { joinColumn: 'nro_ficha' })
    ficha!: Rel<FichaMedica>;

    @ManyToOne(() => Vacuna, { joinColumn: 'nro_vacuna' })
    vacuna!: Rel<Vacuna>;

    @Property({ type: 'datetime' })
    fecha_hora!: Date;

    @Property({ type: 'number' })
    cantidad!: number;

}