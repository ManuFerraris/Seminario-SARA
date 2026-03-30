import { Adoptante } from "../../../entities/adoptante.entity.js";
import { AdoptanteDTO } from "../adoptanteDTO.js";
import { AdoptanteRepository } from "../adoptante.repositoty.js";
import { PersonaRepository } from "../../persona.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";
import { validarActualizacionAdoptante } from "../validarActualizacionAdoptante.js";

export class UpdateAdoptante {
    constructor(
        private adoptanteRepo: AdoptanteRepository, 
        private personaRepo: PersonaRepository
    ) {};
    async ejecutar (numero_persona: number, dto: AdoptanteDTO): Promise<ServiceResponse<Adoptante>> {
        
        const persona = await this.personaRepo.findOne(numero_persona);
        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada"],
                data: undefined
            };
        };
        
        const adoptante = await this.adoptanteRepo.findOne(numero_persona);
        if (!adoptante) {
            return {
                status: 404,
                success: false,
                messages: ["Adoptante no encontrado"],
                data: undefined
            };
        };
        const errores = validarActualizacionAdoptante(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };
        
        const adoptanteActualizado = await this.adoptanteRepo.update(adoptante, dto);
        return {
            status: 200,
            success: true,
            messages: ["Adoptante actualizado correctamente"],
            data: adoptanteActualizado
        };
    };
}