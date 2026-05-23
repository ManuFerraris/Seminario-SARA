import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AdoptanteRepository } from "../../persona/adoptante/adoptante.repositoty.js";
import { ColaboradorRepository } from "../../persona/colaborador/colaborador.repository.js";
import { validarActualizacionEntrevista } from "../validarActualizacionEntrevista.js";

export class UpdateEntrevista {
    constructor( 
        private entRepo: EntrevistaRepository,
        private colabRepo: ColaboradorRepository,
        private adoptRepo: AdoptanteRepository
    ) {}

    async ejecutar(
        numero_adoptante: number, 
        id_colaborador: string, 
        fecha_hora: Date, 
        dto: any ): Promise<ServiceResponse<Entrevista>> {
        
        // 1. Validación de los datos de entrada
        const errores = validarActualizacionEntrevista(dto);
        if(errores.length > 0){
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        // 2. Buscar las entidades dependientes (Igual que en tu GetOne)
        const colaborador = await this.colabRepo.findOne(String(id_colaborador));
        if (!colaborador) {
            return {
                success: false,
                status: 404,
                messages: ["Colaborador no encontrado"],
                data: undefined
            };
        }

        const adoptante = await this.adoptRepo.findOne(numero_adoptante);
        if (!adoptante) {
            return {
                success: false,
                status: 404,
                messages: ["Adoptante no encontrado"],
                data: undefined
            };
        }

        // 3. Buscar la entrevista original en la base de datos
        const entrevista = await this.entRepo.buscarEntrevista(adoptante, colaborador, fecha_hora);
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["No se encontró la entrevista solicitada para actualizar."],
                data: undefined
            };
        }

        console.log("Fecha hora de reposición de entrevista original encontrada:", entrevista.fecha_hora_rep);
        const fechaRepActual = new Date(entrevista.fecha_hora_rep);
        console.log("Fecha hora de reposición de entrevista enviada en DTO:", dto.fecha_hora_rep);
        const fechaRepNueva = new Date(dto.fecha_hora_rep ? dto.fecha_hora_rep : entrevista.fecha_hora_rep);
        if (fechaRepNueva.getTime() <= fechaRepActual.getTime()) {
            console.log("Error de cronología: La fecha de reposicion no puede ser anterior a la fecha actual.");
            return {
                status: 400,
                success: false,
                messages: ["Conflicto cronológico: La fecha de reposicion no puede ser anterior a la fecha actual."],
                data: undefined
            };
        }

        // 4. Mapeo selectivo de actualización
        // Solo actualizamos lo que nos enviaron en el DTO
        
        if (dto.fecha_hora_rep) entrevista.fecha_hora_rep = new Date(dto.fecha_hora_rep);
        console.log("Entrevista después de actualizar fecha_hora_rep:", entrevista.fecha_hora_rep);
        if (dto.estado !== undefined) entrevista.estado = dto.estado;
        if (dto.descripcion !== undefined) entrevista.descripcion = dto.descripcion;
        if (dto.aprobada !== undefined) entrevista.aprobada = dto.aprobada;

        // 5. Persistencia (usamos el update genérico del ORM o un em.flush() si usas persist implícito)
        // Ajusta la llamada según tengas definido el update en tu EntrevistaRepository
        const entrevistaActualizada = await this.entRepo.actualizarEntrevista(entrevista);

        return {
            success: true,
            status: 200,
            messages: ["Entrevista actualizada exitosamente"],
            data: entrevistaActualizada
        };
    }
}