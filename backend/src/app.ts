import 'reflect-metadata';
import express from 'express';
import { orm } from './shared/mikro-orm.config.js';
import { animalRouter } from './animal/animal.routes.js';
import { personaRouter } from './persona/persona.routes.js';
import { adoptanteRouter } from './persona/adoptante/adoptante.routes.js';
import { veterinarioRouter } from './persona/veterinario/veterinario.routes.js';

const app = express();
app.locals.orm = orm

// Este middleware le enseña a Express a leer e interpretar JSONs
app.use(express.json());

// Rutas de la API
app.use("/api/animal", animalRouter);
app.use("/api/persona", personaRouter);
app.use("/api/adoptante", adoptanteRouter);
app.use("/api/veterinario", veterinarioRouter);

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000/`);
});