import bcrypt from 'bcrypt';
import { PersonaRepository } from "../persona.repository.js";
import { VeterinarioRepository } from "../vet.repository.js";
import { ColaboradorRepository } from "../col.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionPersona } from "../validarCreacionPersona.js";
import { Veterinario } from '../../entities/veterinario.entity.js';
import { Colaborador } from '../../entities/colaborador.entity.js';
import { Persona } from '../../entities/persona.entity.js';
import { Adoptante } from '../../entities/adoptante.entity.js';
import { AdoptanteRepository } from '../ado.repository.js';

interface payloadFront {
    dni: string,
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    domicilio: string,
    isVeterinario: false,
    isColaborador: false,
    contrasenia: string,
    confirmarContrasenia: string,
    anios_experiencia?: number,
    matricula? : string,
};

export class GestionPersonal {
    constructor(
        private readonly personaRepository: PersonaRepository,
        private readonly veterinarioRepository: VeterinarioRepository,
        private readonly colaboradorRepository: ColaboradorRepository,
        private readonly adoptanteRepository: AdoptanteRepository
    ) {}

    async ejecutar(payload: payloadFront): Promise<ServiceResponse<Persona | Veterinario | Colaborador>> {
        
        const resultados: string[] = [];

        // 1. Validación de roles requeridos
        if (!payload.isVeterinario && !payload.isColaborador) {
            return {
                status: 400,
                success: false,
                messages: ["Debe seleccionar al menos un rol: Veterinario o Colaborador"],
                data: undefined
            };
        }

        // --- SOLUCIÓN: VALIDACIÓN GLOBAL DE MATRÍCULA ---
        // Lo verificamos primero, antes de crear o actualizar nada.
        if (payload.isVeterinario) {
            if (!payload.matricula) {
                return {
                    status: 400,
                    success: false,
                    messages: ["La matrícula es obligatoria para registrar un veterinario"],
                    data: undefined
                };
            }

            const vetExistente = await this.veterinarioRepository.findOne(payload.matricula);
            if (vetExistente) {
                return {
                    status: 400,
                    success: false,
                    messages: ["Ya existe un veterinario registrado con esa matrícula"],
                    data: undefined
                };
            }
        }
        // ------------------------------------------------
        
        const personaExistente = await this.personaRepository.findOne(payload.dni);
        let personaTarget: Persona;

        // 2. Flujo si la persona YA EXISTE
        if (personaExistente) {
            personaTarget = personaExistente;

            // Evaluamos si intenta agregar un rol que YA POSEE
            if (payload.isColaborador) {
                const colaboradorExistente = await this.colaboradorRepository.findOneByPersona(personaTarget);
                if (colaboradorExistente) {
                    return {
                        status: 400,
                        success: false,
                        messages: ["Esta persona ya es colaborador"],
                        data: undefined
                    };
                }
            }

            if (payload.isVeterinario) {
                const veterinarioExistente = await this.veterinarioRepository.findOneByPersona(personaTarget);
                if (veterinarioExistente) {
                    return {
                        status: 400,
                        success: false,
                        messages: ["Esta persona ya es veterinario"],
                        data: undefined
                    };
                }
            }
            
            resultados.push("Persona encontrada. Asignando nuevos roles...");

        } else {
            // 3. Flujo si la persona ES NUEVA
            if (payload.contrasenia !== payload.confirmarContrasenia) {
                return {
                    status: 400,
                    success: false,
                    messages: ["Las contraseñas no coinciden"],
                    data: undefined
                };
            }

            const validacion = validarCreacionPersona(payload);
            if (validacion.length > 0) {
                return {
                    status: 400,
                    success: false,
                    messages: validacion,
                    data: undefined
                };
            }

            // Ya no buscamos la matricula aquí porque lo hicimos arriba

            const SALT_ROUNDS = 10;
            const hashedPassword = await bcrypt.hash(payload.contrasenia, SALT_ROUNDS);
            
            const nuevaPersona = new Persona();
            nuevaPersona.dni = payload.dni;
            nuevaPersona.nombre = payload.nombre;
            nuevaPersona.apellido = payload.apellido;
            nuevaPersona.email = payload.email;
            nuevaPersona.telefono = payload.telefono;
            nuevaPersona.domicilio = payload.domicilio;
            nuevaPersona.contrasenia = hashedPassword;

            personaTarget = await this.personaRepository.create(nuevaPersona);
            resultados.push("Persona creada exitosamente.");
        }

        // 4. Asignación de Roles a la Persona (Existente o Nueva)
        if (payload.isVeterinario) {
            const nuevoVeterinario = new Veterinario();
            nuevoVeterinario.persona = personaTarget;
            // Aseguramos que los datos vengan en el payload con el operador '!' o validamos antes
            nuevoVeterinario.anios_experiencia = payload.anios_experiencia!;
            nuevoVeterinario.matricula = payload.matricula!;
            await this.veterinarioRepository.create(nuevoVeterinario);
            resultados.push("Veterinario creado exitosamente");
        }

        if (payload.isColaborador) {
            const nuevoColaborador = new Colaborador();
            nuevoColaborador.persona = personaTarget;
            await this.colaboradorRepository.create(nuevoColaborador);
            resultados.push("Colaborador creado exitosamente");
        }

        const adoptanteExistente = await this.adoptanteRepository.findOneByPersona(personaTarget);
        if (!adoptanteExistente) {
            const nuevoAdoptante = new Adoptante();
            nuevoAdoptante.persona = personaTarget;
            nuevoAdoptante.estado = 'Apto'; // Pre-aprobado
            await this.adoptanteRepository.create(nuevoAdoptante);
        }

        // 5. Retorno Exitoso
        return {
            status: personaExistente ? 200 : 201, 
            success: true,
            messages: resultados,
            data: personaTarget
        };
    }
}