import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import type { Rel } from '@mikro-orm/core';
import { Animal } from './animal.entity.js';

@Entity()
export class Audiovisual {

    // PK Subrogada pura, autonumérica
    @PrimaryKey({ type: 'number', autoincrement: true })
    id_audiovisual!: number;

    // Relación N a 1 con envoltura Rel para evitar dependencias circulares
    @ManyToOne(() => Animal, { joinColumn: 'nro_animal' })
    animal!: Rel<Animal>;
    
    @Property({ type: 'string', length: 255 })
    url_material!: string;

    @Property({ type: 'string',  length: 255, nullable: true })
    descripcion?: string;

}