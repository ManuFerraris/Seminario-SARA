import { Request, Response } from 'express';
import { Router } from 'express';
import { AuthController } from '../login/authController.js';
import { LoginPersona } from '../login/loginPersona.js';
import { PersonaRepositoryORM } from '../persona/persona.repositoryORM.js'; 
import { MikroORM } from '@mikro-orm/sql';
import { VeterinarioRepositoryORM } from '../persona/vet.repositoryORM.js';
import { AdoptanteRepositoryORM } from '../persona/ado.repositoryORM.js';
import { ColaboradorRepositoryORM } from '../persona/col.repositoryORM.js';

// Creo el controlador
export const authRouterController = async (req: Request, res: Response) => {
    const orm = (req.app.locals as { orm: MikroORM }).orm;
    const em = orm.em.fork();

    const personaRepo = new PersonaRepositoryORM(em);
    const colaboradorRepo = new ColaboradorRepositoryORM(em);
    const adoptanteRepo = new AdoptanteRepositoryORM(em);
    const veterinarioRepo = new VeterinarioRepositoryORM(em);
    const loginUseCase = new LoginPersona(personaRepo, colaboradorRepo, adoptanteRepo, veterinarioRepo);
    const authController = new AuthController(loginUseCase);
    
    await authController.login(req, res);
};

// Ruteo
export const authRouter = Router();
authRouter.post('/login', authRouterController);