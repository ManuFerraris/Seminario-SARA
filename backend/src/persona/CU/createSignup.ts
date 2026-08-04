import bcrypt from 'bcrypt';
import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionPersona } from "../validarCreacionPersona.js";
import { Adoptante } from '../../entities/adoptante.entity.js';
import { AdoptanteRepository } from '../ado.repository.js';

export class CreateSignup {
    constructor(
        private readonly repo: PersonaRepository,
        private readonly adoptanteRepo: AdoptanteRepository
    ) {}

    async ejecutar(dto: PersonaDTO): Promise<ServiceResponse<Persona>> {
        console.log("Ejecutando CreateSignup con DTO:", dto);
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
        nuevaPersona.telefono = dto.telefono;

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(dto.contrasenia, SALT_ROUNDS);
        nuevaPersona.contrasenia = hashedPassword;

        await this.repo.create(nuevaPersona);
        
        const adoptanteNuevo = new Adoptante();
        adoptanteNuevo.persona = nuevaPersona;
        adoptanteNuevo.estado = 'Apto';
        await this.adoptanteRepo.create(adoptanteNuevo);

        console.log("Persona y Adoptante creados exitosamente:", nuevaPersona, adoptanteNuevo);
        return {
            success: true,
            status: 201,
            messages: ['Persona creada exitosamente'],
            data: nuevaPersona
        };
    }
}