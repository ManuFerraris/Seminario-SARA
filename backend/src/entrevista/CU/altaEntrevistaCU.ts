import { Entrevista } from '../../entities/entrevista.entity.js';
import { EntityManager } from '@mikro-orm/core';
import { AnimalRepository } from '../../animal/animal.repository.js';
import { EntrevistaRepository } from '../entrevista.repository.js';
import { PersonaRepository } from '../../persona/persona.repository.js';
import { ServiceResponse } from '../../types/service.response.js';
import { ColaboradorRepository } from '../../persona/col.repository.js';
import { AdoptanteRepository } from '../../persona/ado.repository.js';

export interface AltaEntrevistaDTO {
    dni_adoptante: string;
    dni_colaborador: string;
    nro_animal: number;
    fecha_hora: Date;
    fecha_hora_rep: Date | null;
    estado: string;
    descripcion?: string;
    aprobada?: boolean;
}

export class AltaEntrevistaCU {
    constructor(
        private readonly personaRepo: PersonaRepository,
        private readonly colaboradorRepo: ColaboradorRepository,
        private readonly adoptanteRepo: AdoptanteRepository,
        private readonly animalRepo: AnimalRepository,
        private readonly entrevistaRepo: EntrevistaRepository,
        private readonly em: EntityManager
    ) {}

    async ejecutar(dto: any): Promise<ServiceResponse<any>> {
        // 1. Validación del Adoptante (Regla de negocio: Lista Negra)
        const persona = await this.personaRepo.findOne(dto.dni_adoptante);
        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada."],
                data: undefined
            };
        }

        const adoptante = await this.adoptanteRepo.findOneByPersona(persona);
        if (!adoptante) {
            return {
                status: 404,
                success: false,
                messages: ["Adoptante no encontrado."],
                data: undefined
            };
        }

        if (adoptante.estado === 'No apto') {
            return { 
                status: 403,
                success: false, 
                messages: ["El adoptante se encuentra inhabilitado para adoptar debido a infracciones previas."], 
                data: undefined 
            };
        }

        const colaboradores = await this.colaboradorRepo.findAll();
        const colaborador1 = colaboradores[0];
        if (!colaborador1) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró un colaborador para asignar la entrevista. Por favor, comuniquese con el equipo de la protectora.`],
                data: undefined
            };
        }

        // 2. Validación del Animal (Condición de carrera)
        const animal = await this.animalRepo.getOne(dto.nro_animal);
        if (!animal) {
            return {
                status: 404,
                success: false,
                messages: ["Animal no encontrado."],
                data: undefined
            };
        }

        if (animal.estado !== 'Disponible') {
            return { 
                status: 409,
                success: false, 
                messages: ["El animal ya no se encuentra disponible para adopción."], 
                data: undefined 
            };
        }

        try {
            // 3. Transacción Atómica
            const nuevaEntrevista = await this.em.transactional(async (emTransaccional) => {
                
                // A. Cambiamos el estado del animal para "bloquearlo" temporalmente
                animal.estado = 'No disponible';
                emTransaccional.persist(animal);

                // B. Creamos la entrevista
                const entrevista = new Entrevista();
                entrevista.adoptante = adoptante;
                entrevista.colaborador = colaborador1; // Se asignará más adelante según el token JWT
                entrevista.fecha_hora = new Date(dto.fecha_hora);
                entrevista.fecha_hora_rep = dto.fecha_hora_rep ? new Date(dto.fecha_hora_rep) : null;
                entrevista.estado = dto.estado;
                entrevista.animal = animal;
        
                if (dto.descripcion) entrevista.descripcion = dto.descripcion;
                
                emTransaccional.persist(entrevista);
                return entrevista;
            });

            // 4. Retornamos los datos exactos que necesita tu componente React
            return { 
                status: 201, 
                success: true, 
                messages: ["Entrevista registrada con éxito."], 
                data: {
                    id_entrevista: nuevaEntrevista.id_entrevista,
                    nro_animal: animal.nro_animal,
                    dni_adoptante: adoptante.persona.dni,
                    estado_animal: animal.estado
                } 
            };

        } catch (error: any) {
            console.error('Error en el Caso de Uso AltaEntrevista:', error);
            return { status: 500, success: false, messages: ["Ocurrió un error al registrar la entrevista."], data: undefined };
        }
    }
}