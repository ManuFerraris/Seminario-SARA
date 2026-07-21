import 'reflect-metadata';
import dotenv from 'dotenv';
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver, defineConfig } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { Animal } from '../entities/animal.entity.js';
import { Persona } from '../entities/persona.entity.js';
import { Donacion } from '../entities/donacion.entity.js';
import { Vacuna } from '../entities/vacuna.entity.js';
import { Adopcion } from '../entities/adopcion.entity.js';
import { Seguimiento } from '../entities/seguimiento.entity.js';
import { Entrevista } from '../entities/entrevista.entity.js';
import { FichaMedica } from '../entities/ficha-medica.entity.js';
import { Rescate } from '../entities/rescate.entity.js';
import { Audiovisual } from '../entities/audiovisual.entity.js';
import { Colocacion } from '../entities/colocacion.entity.js';

dotenv.config();
const DB_URL = process.env.DB_URL as string;
const DB_NAME = process.env.DB_NAME as string;
//const SSL_MODE = process.env.SSL_MODE as string;

const config = defineConfig({
    entities: [Animal, Persona, Donacion, Vacuna, Adopcion
        , Seguimiento, Entrevista, FichaMedica, Rescate, Audiovisual, Colocacion],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: DB_NAME,
    driver: MySqlDriver,
    clientUrl: DB_URL,
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});

// 2. EXPORTACIÓN POR DEFECTO PARA EL CLI
// Cuando ejecutes un comando en la consola, MikroORM leerá esto automáticamente.
export default config;

// 3. INICIALIZACIÓN PARA TU SERVIDOR
// Tu app.ts seguirá importando 'orm' de aquí sin darse cuenta del cambio.
export const orm = await MikroORM.init(config);

export const syncSchema = async () => {
    // PRECAUCIÓN: NO LLAMAR todavía para no sobreescribir nuestro script SQL manual
    const generator = orm.schema;
    await generator.update();
};

export const em = orm.em.fork();