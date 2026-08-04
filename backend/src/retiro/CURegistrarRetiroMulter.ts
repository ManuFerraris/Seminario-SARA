import { EntityManager } from '@mikro-orm/core';
import { AdopcionRepository } from '../adopcion/adopcion.repository.js';
import { Audiovisual } from '../entities/audiovisual.entity.js';
import { ServiceResponse } from '../types/service.response.js';
import fs from 'fs/promises';

export interface RegistrarRetiroDTO {
    nro_adopcion: number;
    motivos: string;
    descripcion_evidencia: string;
    fecha_retiro: Date;
    archivos: Express.Multer.File[]; // Multer nos entrega las propiedades .filename y .path
}

export class RegistrarRetiroMaltratoMulter {
    constructor(
        private readonly adopcionRepo: AdopcionRepository,
        private readonly em: EntityManager
    ) {}

    async ejecutar(dto: RegistrarRetiroDTO): Promise<ServiceResponse<any>> {
        const adopcion = await this.adopcionRepo.getOneAdopcion(dto.nro_adopcion);
        if (!adopcion) {
            return { 
                status: 404, 
                success: false, 
                messages: ["Adopción no encontrada."], 
                data: undefined 
            };
        }

        if (adopcion.fecha_retiro) {
            return { 
                status: 400,
                success: false,
                messages: ["El retiro para dicha adopción ya ha sido registrado previamente."], 
                data: undefined 
            };
        }

        const urlsLocales: string[] = [];
        const rutasFisicas: string[] = []; // Guardamos las rutas reales para el rollback

        try {
            // 2. ARMADO DE URLs (Multer ya guardó los archivos físicos)
            if (dto.archivos && dto.archivos.length > 0) {
                for (const archivo of dto.archivos) {
                    // Armamos la ruta que consumirá el frontend (ej: /api/uploads/evidencias/16900000-foto.jpg)
                    urlsLocales.push(`/api/uploads/evidencias/${archivo.filename}`);
                    // Guardamos la ruta del sistema operativo para poder borrar el archivo si hace falta
                    rutasFisicas.push(archivo.path); 
                }
            }

            // 3. TRANSACCIÓN EN MIKRO-ORM
            await this.em.transactional(async (emTransaccional) => {
                
                // A. Actualizamos estados
                const animal = adopcion.animal;
                animal.estado = 'No disponible';
                emTransaccional.persist(animal);

                const adoptante = adopcion.adoptante;
                adoptante.estado = 'No apto';
                emTransaccional.persist(adoptante);

                // B. Actualizamos la Adopcion
                adopcion.fecha_retiro = dto.fecha_retiro;
                adopcion.motivos_retiro = dto.motivos;
                adopcion.evidencia_maltrato = dto.descripcion_evidencia;
                emTransaccional.persist(adopcion);

                // C. Registramos los Audiovisuales en la BD con las URLs locales
                for (const url of urlsLocales) {
                    const audiovisual = new Audiovisual();
                    audiovisual.url_material = url;
                    audiovisual.animal = adopcion.animal;
                    emTransaccional.persist(audiovisual);
                }
            });

            return {
                status: 201, 
                success: true, 
                messages: ["Retiro registrado exitosamente."], 
                data: {
                    nro_adopcion: adopcion.nro_adopcion,
                    estado_adoptante: adopcion.adoptante.estado,
                    estado_animal: adopcion.animal.estado
                } 
            };

        } catch (error: any) {
            // 4. ROLLBACK LOCAL (Cleanup)
            // Si la base de datos falló, borramos las imágenes que Multer guardó en el disco
            if (rutasFisicas.length > 0) {
                console.log("Error en BD. Haciendo rollback local borrando archivos:", rutasFisicas);
                await Promise.all(
                    rutasFisicas.map(ruta => 
                        // Usamos unlink y atrapamos posibles errores (ej. si el archivo no existe)
                        fs.unlink(ruta).catch(e => console.error(`Error borrando ${ruta}:`, e))
                    )
                );
            }
            
            console.error('Error en el Caso de Uso de Retiro:', error);
            return { 
                status: 500, 
                success: false, 
                messages: ["Ocurrió un error al registrar el retiro. Se deshicieron los cambios."], 
                data: undefined 
            };
        }
    }
}