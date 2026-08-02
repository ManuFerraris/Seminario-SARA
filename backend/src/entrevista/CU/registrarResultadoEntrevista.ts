import { Entrevista } from "../../entities/entrevista.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { EntrevistaRepository } from "../entrevista.repository.js";

export class RegistrarResultadoEntrevista {
    constructor(private entRepo: EntrevistaRepository) {}

    async ejecutar(id_entrevista: number, dto: any): Promise<ServiceResponse<Entrevista>> {
        
        // 1. Buscar la entrevista por ID (asegurando que traiga al animal, gracias al populate que agregamos)
        const entrevista = await this.entRepo.buscarEntrevista(id_entrevista);
        
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["No se encontró la entrevista solicitada."],
                data: undefined
            };
        }

        // 2. Validación de Estado (solo se evalúan entrevistas pendientes)
        if ((entrevista.estado !== 'Pendiente') && (entrevista.estado !== 'Reprogramada')) {
            return {
                success: false,
                status: 400,
                messages: [`La entrevista ya fue procesada anteriormente. Estado actual: ${entrevista.estado}`],
                data: undefined
            };
        }

        // 3. Mapeo del resultado
        entrevista.estado = dto.estado; // 'Aprobada', 'Rechazada', 'Cancelada'
        entrevista.descripcion = dto.descripcion;

        // 4. Regla de Negocio CLAVE: Liberar al animal si no se aprobó
        if (dto.estado === 'Rechazada' || dto.estado === 'Cancelada') {
            if (entrevista.animal) {
                // Asumo que 'Disponible' es el estado en tu BD. Cambialo si usas otro string.
                entrevista.animal.estado = 'Disponible'; 
            }
        }

        // 5. Persistencia
        // Como Mikro-ORM trackea las entidades, al hacer flush() guardará tanto la entrevista como el cambio en el animal.
        const entrevistaActualizada = await this.entRepo.actualizarEntrevista(entrevista);

        return {
            success: true,
            status: 200,
            messages: [`Entrevista ${dto.estado.toLowerCase()} exitosamente.`],
            data: entrevistaActualizada
        };
    }
}