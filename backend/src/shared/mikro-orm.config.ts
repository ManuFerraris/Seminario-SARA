import 'reflect-metadata';
import dotenv from 'dotenv';
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Animal } from '../entities/animal.entity.js';
import { Persona } from '../entities/persona.entity.js';
import { Veterinario } from '../entities/veterinario.entity.js';
import { Adoptante } from '../entities/adoptante.entity.js';
import { Colaborador } from '../entities/colaborador.entity.js';
import { Donacion } from '../entities/donacion.entity.js';
import { Vacuna } from '../entities/vacuna.entity.js';
import { Adopcion } from '../entities/adopcion.entity.js';
import { Seguimiento } from '../entities/seguimiento.entity.js';
import { Entrevista } from '../entities/entrevista.entity.js';
import { FichaMedica } from '../entities/ficha-medica.entity.js';
import { Rescate } from '../entities/rescate.entity.js';
import { Rescatista } from '../entities/rescatista.entity.js';
import { Audiovisual } from '../entities/audiovisual.entity.js';
import { AsignadaEn } from '../entities/asignada-en.entity.js';

dotenv.config();
const DB_URL = process.env.DB_URL as string;
const DB_NAME = process.env.DB_NAME as string;
const SSL_MODE = process.env.SSL_MODE as string;

export const orm = await MikroORM.init({
    entities: [Animal, Persona, Veterinario, Adoptante, Colaborador,
        Donacion, Vacuna, Adopcion, Seguimiento, Entrevista, FichaMedica,
        Rescate, Rescatista, Audiovisual, AsignadaEn],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: DB_NAME,
    driver: MySqlDriver,
    clientUrl: DB_URL,
    highlighter: new SqlHighlighter(),
    debug: true,
    // Esto le dice al driver de MySQL que fuerce la encriptación SSL
    // pero que no exija un archivo de certificado físico en nuestra computadora.
    driverOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});

export const syncSchema = async () => {
    // PRECAUCIÓN: NO LLAMAR todavía para no sobreescribir nuestro script SQL manual
    const generator = orm.schema;
    await generator.update();
};

export const em = orm.em.fork();