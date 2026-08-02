import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import type { Rel } from '@mikro-orm/core';
import { Animal } from './animal.entity.js';

@Entity()
export class Audiovisual {

    @PrimaryKey({ type: 'number', autoincrement: true })
    id_audiovisual!: number;

    @ManyToOne(() => Animal, { joinColumn: 'nro_animal' })
    animal!: Rel<Animal>;
    
    @Property({ type: 'string', length: 255 })
    url_material!: string;

    @Property({ type: 'string',  length: 255, nullable: true })
    descripcion?: string;

}