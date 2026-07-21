import { Rescate } from "../../entities/rescate.entity.js";
import { RescateDTO } from "../rescateDTO.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";

export class UpdateRescate {
    constructor(private rescateRepository: RescateRepository,) {}

    async ejecutar(nro_rescate: number, dto: Partial<RescateDTO>): Promise<ServiceResponse<Rescate>> {
        
        // 1. VALIDACIÓN SÍNCRONA
        if (dto.lugar_rescate !== undefined && (dto.lugar_rescate.trim().length === 0 || dto.lugar_rescate.length > 255)) {
            return {
                success: false,
                status: 400,
                messages: ["El lugar del rescate debe tener entre 1 y 255 caracteres"],
                data: undefined
            };
        }

        // 2. BUSCAR ENTIDAD ORIGINAL POR PK
        const rescateExistente = await this.rescateRepository.getOneRescate(nro_rescate);
        
        if (!rescateExistente) {
            return {
                success: false,
                status: 404,
                messages: ["Rescate no encontrado para actualizar"],
                data: undefined
            };
        }

        // 3. ACTUALIZACIÓN SELECTIVA Y PERSISTENCIA
        if (dto.lugar_rescate !== undefined) {
            rescateExistente.lugar_rescate = dto.lugar_rescate.trim();
        }
        
        if (dto.fecha_rescate !== undefined) {
            rescateExistente.fecha_rescate = new Date(dto.fecha_rescate);
        }

        await this.rescateRepository.updateRescate(rescateExistente);
        
        return {
            success: true,
            status: 200,
            messages: ["Rescate actualizado correctamente"],
            data: rescateExistente
        };
    }
}