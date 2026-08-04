import { EntityManager } from '@mikro-orm/core';
import { Colocacion } from '../../entities/colocacion.entity.js';
import { FichaMedicaRepository } from '../../fichaMedica/fichaMedica.repository.js';
import { ServiceResponse } from '../../types/service.response.js';
import { VacunaRepository } from '../../vacuna/vacuna.repository.js';
import { ColocacionRepository } from '../colocacion.repository.js';

export interface VacunaColocadaItemDTO {
    nro_vacuna: number;
    cantidad: number;
}

export interface RegistroColocacionesDTO {
    nro_ficha: number;
    vacunas_colocadas: VacunaColocadaItemDTO[];
}

export class RegistrarColocacionesMasivas {
    constructor(
        private readonly colocacionRepository: ColocacionRepository,
        private readonly fichaRepository: FichaMedicaRepository,
        private readonly vacunaRepository: VacunaRepository,
        private readonly em: EntityManager
    ) {}

    async ejecutar(dto: RegistroColocacionesDTO): Promise<ServiceResponse<any>> {
        // 1. Validación inicial
        if (!dto.vacunas_colocadas || dto.vacunas_colocadas.length === 0) {
            return { status: 400, success: false, messages: ["Debe enviar al menos una vacuna."], data: undefined };
        }

        // 2. Buscar la ficha médica (fuera de la transacción para fallar rápido si no existe)
        const ficha = await this.fichaRepository.getOneFichaMedica(dto.nro_ficha);
        if (!ficha) {
            return { status: 404, success: false, messages: ["Ficha médica no encontrada."], data: undefined };
        }

        const vacunasActualizadas: any[] = [];

        try {
            // 3. INICIO DE LA TRANSACCIÓN
            // Todo lo que ocurra dentro de esta función es atómico (se guarda todo o no se guarda nada)
            await this.em.transactional(async (emTransaccional) => {
                
                for (const item of dto.vacunas_colocadas) {
                    const vacuna = await this.vacunaRepository.getOneVacuna(item.nro_vacuna);
                    
                    if (!vacuna) {
                        throw new Error(`Vacuna con código ${item.nro_vacuna} no encontrada.`); // Esto corta la transacción
                    }

                    if (vacuna.stock < item.cantidad) {
                        throw new Error(`Stock insuficiente para la vacuna '${vacuna.droga || item.nro_vacuna}'.`);
                    }

                    if(new Date(vacuna.fecha_vencimiento) <= new Date()) {
                        throw new Error(`La vacuna '${vacuna.droga || item.nro_vacuna}' está vencida y no puede ser colocada.`);
                    }

                    const nuevaColocacion = new Colocacion();
                    nuevaColocacion.ficha = ficha;
                    nuevaColocacion.vacuna = vacuna;
                    nuevaColocacion.fecha_hora = new Date();
                    nuevaColocacion.cantidad = item.cantidad;

                    emTransaccional.persist(nuevaColocacion);
                    
                    vacuna.stock -= item.cantidad;
                    emTransaccional.persist(vacuna);

                    // Preparamos la respuesta que espera tu frontend
                    vacunasActualizadas.push({
                        nro_vacuna: vacuna.nro_vacuna,
                        stock_actualizado: vacuna.stock
                    });
                }
            });

            return { 
                status: 201, 
                success: true, 
                messages: ["Colocaciones registradas exitosamente."], 
                data: {
                    nro_ficha: ficha.nro_ficha,
                    vacunas_actualizadas: vacunasActualizadas
                } 
            };

        } catch (error: any) {
            // Si cualquier throw ocurre dentro de em.transactional(), Mikro-ORM hace ROLLBACK automáticamente.
            return { 
                status: 400, // Bad Request porque probablemente fue falta de stock o error de validación
                success: false, 
                messages: [error.message || "Ocurrió un error al registrar las colocaciones."], 
                data: undefined 
            };
        }
    }
}