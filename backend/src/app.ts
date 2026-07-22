import 'reflect-metadata';
import express from 'express';
import { orm } from './shared/mikro-orm.config.js';
import { animalRouter } from './animal/animal.routes.js';
import { personaRouter } from './persona/persona.routes.js';
import { donacionRouter } from './donacion/donacion.router.js';
import { vacunaRouter } from './vacuna/vacuna.routes.js';
import { entrevistaRouter } from './entrevista/entrevista.router.js';
import { rescateRouter } from './rescate/rescate.routes.js';
import { audiovisualRouter } from './audiovisual/aud.routes.js';
import { adopcionRouter } from './adopcion/adopcion.routes.js';
import { fichaMedicaRouter } from './fichaMedica/fichaMedica.routes.js';
import { colocacionRouter } from './colocacion/colocacion.routes.js';
import { seguimientoRouter } from './seguimiento/seg.routes.js';
import { authRouter } from './login/auth.routes.js';

const app = express();
app.locals.orm = orm

// Este middleware le enseña a Express a leer e interpretar JSONs
app.use(express.json());

// Rutas de la API
app.use("/api/animal", animalRouter);
app.use("/api/persona", personaRouter);
app.use("/api/donacion", donacionRouter);
app.use("/api/vacuna", vacunaRouter);
app.use("/api/entrevista", entrevistaRouter);
app.use("/api/rescate", rescateRouter);
app.use("/api/audiovisual", audiovisualRouter);
app.use("/api/adopcion", adopcionRouter);
app.use("/api/fichamedica", fichaMedicaRouter);
app.use("/api/colocacion", colocacionRouter);
app.use("/api/seguimiento", seguimientoRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000/`);
});