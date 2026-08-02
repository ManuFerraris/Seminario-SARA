import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Persona } from '../entities/persona.entity.js';
import { PersonaRepositoryORM } from '../persona/persona.repositoryORM.js';
import { Veterinario } from '../entities/veterinario.entity.js';
import { VeterinarioRepositoryORM } from '../persona/vet.repositoryORM.js';
import { Colaborador } from '../entities/colaborador.entity.js';
import { ColaboradorRepositoryORM } from '../persona/col.repositoryORM.js';

export const seedPersonaVeterinario = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        // Instanciamos los repositorios que vamos a usar
        const personaRepo = new PersonaRepositoryORM(em);
        const vetRepo = new VeterinarioRepositoryORM(em);

        const personaExistente = await personaRepo.findOne("40500600");
        if (personaExistente) {
            const nuevoVeterinario = new Veterinario();
            nuevoVeterinario.persona = personaExistente;
            await vetRepo.create(nuevoVeterinario);
            res.status(201).json({ message: "Seed generado exitosamente para el veterinario" });
            return;
        }

        // Si no existe la persona, la creamos y un nuevo veterinario
        // 1. Instanciar y llenar los datos de la Persona
        const nuevaPersona = new Persona();
        nuevaPersona.dni = "40500600";
        nuevaPersona.nombre = "Manuel";
        nuevaPersona.apellido = "Ferraris";
        nuevaPersona.email = "ferrarismanu@gmail.com";
        nuevaPersona.telefono = "2477300400";
        nuevaPersona.domicilio = "Mitre 1400 Piso 4 'C'";

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash("ab123456", SALT_ROUNDS);
        nuevaPersona.contrasenia = hashedPassword;
        const personaGuardada = await personaRepo.create(nuevaPersona);

        // 2. Instanciar y llenar los datos del Veterinario
        const nuevoVeterinario = new Veterinario();
        nuevoVeterinario.matricula = "12500";
        nuevoVeterinario.anios_experiencia = 5;

        // 3. Vincularlos en memoria (Relación OneToOne)
        nuevoVeterinario.persona = personaGuardada; 

        // 4. Guardar en la base de datos
        await vetRepo.create(nuevoVeterinario); 

        res.status(201).json({ message: "Seed generado exitosamente para el veterinario" });
    } catch (error) {
        console.error("Error al ejecutar el seed:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const seedPersonaColaborador = async (req: Request, res: Response): Promise<void> => {
    try {
        const orm = (req.app.locals as { orm: MikroORM }).orm;
        const em = orm.em.fork();
        
        // Instanciamos los repositorios que vamos a usar
        const personaRepo = new PersonaRepositoryORM(em);
        const colaboradorRepo = new ColaboradorRepositoryORM(em);

        const personaExistente = await personaRepo.findOne("40500600");
        if (personaExistente) {
            const nuevoColaborador = new Colaborador();
            nuevoColaborador.persona = personaExistente; 

            await colaboradorRepo.create(nuevoColaborador); 
            res.status(201).json({ message: "Seed generado exitosamente para el colaborador" });
            return;
        }
        // Si no existe la persona, la creamos y un nuevo colaborador
        // 1. Instanciar y llenar los datos de la Persona
        const nuevaPersona = new Persona();
        nuevaPersona.dni = "40500600";
        nuevaPersona.nombre = "Manuel";
        nuevaPersona.apellido = "Ferraris";
        nuevaPersona.email = "ferrarismanu@gmail.com";
        nuevaPersona.telefono = "2477300400";
        nuevaPersona.domicilio = "Mitre 1400 Piso 4 'C'";

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash("ab123456", SALT_ROUNDS);
        nuevaPersona.contrasenia = hashedPassword;
        const personaGuardada = await personaRepo.create(nuevaPersona);

        // 2. Instanciar y llenar los datos del Colaborador
        const nuevoColaborador = new Colaborador();

        // 3. Vincularlos en memoria (Relación OneToOne)
        nuevoColaborador.persona = personaGuardada; 

        // 4. Guardar en la base de datos
        await colaboradorRepo.create(nuevoColaborador); 

        res.status(201).json({ message: "Seed generado exitosamente para el colaborador" });
    } catch (error) {
        console.error("Error al ejecutar el seed:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}