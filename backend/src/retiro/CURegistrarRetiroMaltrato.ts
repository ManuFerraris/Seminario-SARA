import { EntityManager } from '@mikro-orm/core';
import { AdopcionRepository } from '../adopcion/adopcion.repository.js';
import { Audiovisual } from '../entities/audiovisual.entity.js';
import { CloudinaryService } from '../shared/cloudinary.service.js';
import { ServiceResponse } from '../types/service.response.js';

export interface RegistrarRetiroDTO {
    nro_adopcion: number;
    motivos: string;
    descripcion_evidencia: string;
    fecha_retiro: Date;
    archivos: Express.Multer.File[]; // Archivos en memoria
}

export class RegistrarRetiroMaltrato {
    constructor(
        private readonly adopcionRepo: AdopcionRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly em: EntityManager
    ) {}

    async ejecutar(dto: RegistrarRetiroDTO): Promise<ServiceResponse<any>> {
        // 1. Buscamos la adopción (y cargamos las relaciones necesarias)
        const adopcion = await this.adopcionRepo.getOneAdopcion(dto.nro_adopcion);
        if (!adopcion) {
            return { 
                status: 404, 
                success: false, 
                messages: ["Adopción no encontrada."], 
                data: undefined 
            };
        }

        const urlsSubidas: string[] = [];

        try {
            // 2. SUBIDA A CLOUDINARY (Concurrente)
            // Hacemos el upload de todos los archivos en paralelo para que sea más rápido
            if (dto.archivos && dto.archivos.length > 0) {
                const promesasSubida = dto.archivos.map(archivo => 
                    this.cloudinaryService.uploadBuffer(archivo.buffer, 'SARA_Audiovisuales')
                );
                const resultados = await Promise.all(promesasSubida);
                urlsSubidas.push(...resultados);
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

                // B. Actualizamos la Adopcion y el Seguimiento
                adopcion.fecha_retiro = dto.fecha_retiro;
                adopcion.motivos_retiro = dto.motivos;
                adopcion.evidencia_maltrato = dto.descripcion_evidencia;
                emTransaccional.persist(adopcion);

                // El seguimiento se registra en su CU

                // C. Registramos los Audiovisuales en la BD
                for (const url of urlsSubidas) {
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
            // 4. ROLLBACK DE CLOUDINARY
            // Si la base de datos explotó, borramos las imágenes que se acaban de subir a la nube
            if (urlsSubidas.length > 0) {
                console.log("Haciendo rollback en Cloudinary para:", urlsSubidas);
                await Promise.all(urlsSubidas.map(url => this.cloudinaryService.deleteImageByUrl(url)));
            }
            console.error('Error en el Caso de Uso de Retiro:', error);
            return { status: 500, success: false, messages: ["Ocurrió un error al registrar el retiro y las imágenes."], data: undefined };
        }
    }
}