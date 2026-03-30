import { Adoptante } from "../../../entities/adoptante.entity.js";
import { AdoptanteDTO } from "../adoptanteDTO.js";
import { AdoptanteRepository } from "../adoptante.repositoty.js";
import { PersonaRepository } from "../../persona.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";
import { validarCreacionAdoptante } from "../validarCreacionAdoptante.js";

export class CreateAdoptante {
    constructor(
        private adoptanteRepo: AdoptanteRepository,
        private personaRepo: PersonaRepository,
    ) {};

    async ejecutar(dto: AdoptanteDTO): Promise<ServiceResponse<Adoptante>> {
        const adoptanteExistente = await this.adoptanteRepo.findOne(dto.numero_persona);
        if (adoptanteExistente) {
            return {
                status: 400,
                success: false,
                messages: ["La persona ya es un adoptante"],
                data: undefined
            };
        };

        const persona = await this.personaRepo.findOne(dto.numero_persona);
        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada"],
                data: undefined
            };
        };

        const errores = validarCreacionAdoptante(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };
        
        const nuevoAdoptante = new Adoptante();
        nuevoAdoptante.persona = persona;
        nuevoAdoptante.estado = dto.estado;
        nuevoAdoptante.domicilio = dto.domicilio;

        const adoptanteCreado = await this.adoptanteRepo.create(nuevoAdoptante);
        return {
            status: 201,
            success: true,
            messages: ["Adoptante creado exitosamente"],
            data: adoptanteCreado
        };
    };
};