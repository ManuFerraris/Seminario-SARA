import { Adopcion } from "../../entities/adopcion.entity.js";
import { ServiceResponse } from "../../types/service.response";
import { AdopcionRepository } from "../adopcion.repository.js";

export class GetOneAdopcion {
    constructor(private readonly adopcionRepository: AdopcionRepository) {}
    
    // Cambiamos el tipo de retorno a 'any' o a un DTO específico, 
    // ya que agregaremos un campo que no existe en la entidad original de BD
    async ejecutar(numero: number): Promise<ServiceResponse<any>> {
        const adopcion = await this.adopcionRepository.getOneAdopcion(numero);
        
        if (!adopcion) {
            return { 
                success: false, 
                status: 404, 
                messages: ["Adopción no encontrada."], 
                data: undefined 
            };
        }

        // 1. Obtenemos el arreglo de seguimientos de esta adopción
        const seguimientos = adopcion.seguimientos.getItems();

        // 2. Buscamos el seguimiento más próximo a completarse.
        // Asumimos que un seguimiento pendiente es aquel que aún no tiene 'estado_animal'
        const seguimientoPendiente = seguimientos.find(seg => !seg.estado_animal || seg.estado_animal.trim() === '');

        // 3. Armamos un DTO (Data Transfer Object) estructurado para el frontend.
        // Hacemos una copia de la adopción y le inyectamos nuestro nuevo ID.
        const adopcionResponse = {
            ...adopcion, 
            seguimiento_pendiente_id: seguimientoPendiente ? seguimientoPendiente.id_seguimiento : null
        };

        console.log('Adopción obtenida (con seguimiento pendiente):', adopcionResponse);

        return { 
            success: true, 
            status: 200, 
            messages: ["Adopción obtenida exitosamente."], 
            data: adopcionResponse 
        };
    }
}