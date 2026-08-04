import fs from 'fs/promises';
import { Rescate } from "../../entities/rescate.entity.js";
import { Animal } from "../../entities/animal.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { EntityManager } from "@mikro-orm/core";
import { Audiovisual } from "../../entities/audiovisual.entity.js";
import { validarCreacionAnimal } from "../../animal/validarCreacionAnimal.js";

export interface CURegistrarRescate {
    dni_rescatista: string;
    animal_especie: string;
    animal_sexo: "Macho" | "Hembra";
    animal_raza: string;
    animal_peso: number;
    animal_estado: 'No Apto';
    animal_edad_estimada: number;
    animal_descripcion?: string;
    lugar_rescate_descripcion: string;
    fecha_rescate: Date | string;
    fecha_ingreso_animal: Date;
    archivos?: Express.Multer.File[]; // Archivos provenientes de Multer
}

export class RegistrarRescate {
    constructor(
        private rescateRepository: RescateRepository,
        private animalRepository: AnimalRepository,
        private personaRepository: PersonaRepository,
        private em: EntityManager // Inyectamos el EM para la transacción
    ) {}

    async ejecutar(dto: CURegistrarRescate): Promise<ServiceResponse<any>> {
        
        // 1. VALIDACIÓN SÍNCRONA
        if (!dto.lugar_rescate_descripcion || dto.lugar_rescate_descripcion.trim().length === 0 || dto.lugar_rescate_descripcion.length > 255) {
            return { status: 400, success: false, messages: ["El lugar de rescate es obligatorio y debe tener entre 1 y 255 caracteres"], data: undefined };
        }

        const fechaRescate = new Date(dto.fecha_rescate);

        const persona = await this.personaRepository.findOne(dto.dni_rescatista);
        if (!persona) {
            return { status: 404, success: false, messages: ["Persona rescatista no encontrada con el DNI provisto"], data: undefined };
        }

        // Preparar URLs locales y rutas físicas para posible Rollback
        const urlsLocales: string[] = [];
        const rutasFisicas: string[] = [];

        if (dto.archivos && dto.archivos.length > 0) {
            for (const archivo of dto.archivos) {
                // Asumiendo que Multer lo guardó en la carpeta 'rescates'
                urlsLocales.push(`/api/uploads/rescates/${archivo.filename}`);
                rutasFisicas.push(archivo.path); 
            }
        }

        try {
            // 2. INICIAMOS LA TRANSACCIÓN (Atomicity)
            const animalDTO = {
                nro_animal: 0, // Se autogenera
                especie: dto.animal_especie,
                sexo: dto.animal_sexo,
                raza: dto.animal_raza,
                peso: dto.animal_peso,
                estado: dto.animal_estado,
                edad_estimada: dto.animal_edad_estimada,
                descripcion: dto.animal_descripcion,
                fecha_ingreso: new Date(dto.fecha_ingreso_animal)
            };
            const errores = await validarCreacionAnimal(animalDTO);
            if(errores.length > 0){
                return {
                    status: 400,
                    success: false,
                    messages: errores,
                    data: undefined
                };
            };
            
            const resultadoTx = await this.em.transactional(async (emTransaccional) => {
                
                // A. Creamos el animal en memoria (aún no se guarda en BD)
                const animalNuevo = new Animal();
                animalNuevo.especie = dto.animal_especie;
                animalNuevo.sexo = dto.animal_sexo;
                animalNuevo.raza = dto.animal_raza;
                animalNuevo.peso = dto.animal_peso;
                animalNuevo.estado = dto.animal_estado;
                animalNuevo.edad_estimada = dto.animal_edad_estimada;
                animalNuevo.descripcion = dto.animal_descripcion;
                animalNuevo.fecha_ingreso = new Date(dto.fecha_ingreso_animal);

                // B. Verificamos si el rescate ya existe ANTES de persistir nada
                // Nota: Asegúrate de que esta validación en tu repo pueda lidiar con un animal que aún no tiene ID,
                // o haz la validación solo por DNI y Fecha si el animal es siempre nuevo.
                const rescateExistente = await this.rescateRepository.buscarRescatePorRelaciones(persona, animalNuevo, fechaRescate);
                if (rescateExistente) {
                    throw new Error("CONFLICTO_RESCATE"); 
                }

                // C. Persistimos el animal
                emTransaccional.persist(animalNuevo);

                // D. Creamos y persistimos el rescate
                const nuevoRescate = new Rescate();
                nuevoRescate.persona = persona;
                nuevoRescate.animal = animalNuevo;
                nuevoRescate.fecha_rescate = fechaRescate;
                nuevoRescate.lugar_rescate = dto.lugar_rescate_descripcion.trim();
                
                emTransaccional.persist(nuevoRescate);

                // E. Guardamos las fotos (Audiovisuales) asociadas al animal
                for (const url of urlsLocales) {
                    const audiovisual = new Audiovisual();
                    audiovisual.url_material = url;
                    audiovisual.animal = animalNuevo;
                    emTransaccional.persist(audiovisual);
                }

                return nuevoRescate; // Devolvemos el rescate armado
            });

            return {
                success: true,
                status: 201,
                messages: ["Rescate y animal creados exitosamente"],
                data: { 
                    rescate_id: resultadoTx.nro_rescate,
                    nro_animal: resultadoTx.animal.nro_animal
                }
            };

        } catch (error: any) {
            // 3. ROLLBACK: Limpieza de archivos si algo falló
            if (rutasFisicas.length > 0) {
                console.log("Error en BD. Haciendo rollback local borrando fotos del rescate:", rutasFisicas);
                await Promise.all(rutasFisicas.map(ruta => fs.unlink(ruta).catch(e => console.error(e))));
            }

            if (error.message === "CONFLICTO_RESCATE") {
                return { status: 409, success: false, messages: ["El rescate ya se encuentra registrado para esta persona y animal en esa fecha"], data: undefined };
            }

            console.error('Error al ejecutar la transacción de rescate:', error);
            return { status: 500, success: false, messages: ["Error interno al registrar el rescate y sus imágenes."], data: undefined };
        }
    }
}