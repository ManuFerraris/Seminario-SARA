import bcrypt from 'bcrypt';
import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionPersona } from "../validarCreacionPersona.js";

export class CreatePersona {
    constructor(private readonly repo: PersonaRepository) {}

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

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(dto.contrasenia, SALT_ROUNDS);
        nuevaPersona.contrasenia = hashedPassword;

        // Campos opcionales (roles)
        if (dto.telefono) nuevaPersona.telefono = dto.telefono;
        if (dto.matricula) nuevaPersona.matricula = dto.matricula;
        if (dto.anios_experiencia) nuevaPersona.anios_experiencia = dto.anios_experiencia;
        if (dto.id_colaborador) nuevaPersona.id_colaborador = dto.id_colaborador;
        if (dto.id_adoptante) nuevaPersona.id_adoptante = dto.id_adoptante;
        if (dto.estado) nuevaPersona.estado = dto.estado;
        if (dto.domicilio) nuevaPersona.domicilio = dto.domicilio;

        // Ahora sí, MikroORM reconoce qué es esto
        await this.repo.create(nuevaPersona);
        
        return {
            success: true,
            status: 201,
            messages: ['Persona creada exitosamente'],
            data: nuevaPersona
        };
    }
}