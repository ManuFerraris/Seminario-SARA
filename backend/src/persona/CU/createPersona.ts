import bcrypt from 'bcrypt';
import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionPersona } from "../validarCreacionPersona.js";
import { Veterinario } from '../../entities/veterinario.entity.js';
import { Colaborador } from '../../entities/colaborador.entity.js';
import { Adoptante } from '../../entities/adoptante.entity.js';
import { AdoptanteRepository } from '../ado.repository.js';

export class CreatePersona {
    constructor(private readonly repo: PersonaRepository,
        private readonly adopRepo: AdoptanteRepository,
    ) {}

    async ejecutar(dto: PersonaDTO): Promise<ServiceResponse<Persona>> {
        const errores = validarCreacionPersona(dto);
        if (errores.length > 0) {
            return {
                success: false,
                status: 400,
                messages: errores,
                data: undefined
            };
        }

        // Validación de unicidad de DNI (PK)
        const dniExistente = await this.repo.findOne(dto.dni);
        if (dniExistente) {
            return {
                success: false,
                status: 409, // 409 Conflict es más semántico para duplicados
                messages: ['El DNI ya está registrado'],
                data: undefined
            };
        }

        // Validación de unicidad de Email
        const emailExistente = await this.repo.findByEmail(dto.email);
        if (emailExistente) {
            return {
                success: false,
                status: 409,
                messages: ['El email ya está registrado'],
                data: undefined
            };
        }

        const nuevaPersona = new Persona(); // Creamos la instancia de la entidad
        nuevaPersona.dni = dto.dni;
        nuevaPersona.nombre = dto.nombre;
        nuevaPersona.apellido = dto.apellido;
        nuevaPersona.email = dto.email;
        nuevaPersona.domicilio = dto.domicilio;

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(dto.contrasenia, SALT_ROUNDS);
        nuevaPersona.contrasenia = hashedPassword;

        // Campos opcionales (roles) Probablemente tire error porque manda todo junto, debe 
        // mandar una Persona, crearla y luego asignarle los roles, o crear la persona y luego crear los roles y asignarlos a la persona.
        if (dto.telefono) nuevaPersona.telefono = dto.telefono;
        if (dto.anios_experiencia && dto.matricula) {
            const veterinario = new Veterinario();
            veterinario.matricula = dto.matricula;
            veterinario.anios_experiencia = dto.anios_experiencia;
            nuevaPersona.veterinario = veterinario;
        }
        if (dto.id_colaborador) {
            const colaborador = new Colaborador();
            colaborador.id_colaborador = dto.id_colaborador;
            nuevaPersona.colaborador = colaborador;
        }
        if (dto.id_adoptante && dto.estado) {
            const adoptante = new Adoptante();
            adoptante.id_adoptante = dto.id_adoptante;
            nuevaPersona.adoptante = adoptante;
            adoptante.estado = dto.estado;
        }
        if (dto.domicilio) nuevaPersona.domicilio = dto.domicilio;

        await this.repo.create(nuevaPersona);

        //Si o si es adoptante.
        const adoptante = new Adoptante();
        nuevaPersona.adoptante = adoptante;
        adoptante.estado = 'Apto';
        await this.adopRepo.create(adoptante);
        
        return {
            success: true,
            status: 201,
            messages: ['Persona creada exitosamente'],
            data: nuevaPersona
        };
    }
}