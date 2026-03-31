import { Veterinario } from "../../../entities/veterinario.entity.js";
import { VeterinarioRepository } from "../veterinario.repository.js";
import { PersonaRepository } from "../../persona.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";
import { validarCreacionVeterinario } from "../validarCreacionVenerinario.js";
import { VeterinarioDTO } from "../veterinarioDTO.js";

export class CreateVeterinario {
    constructor(
        private veterinarioRepo: VeterinarioRepository,
        private personaRepo: PersonaRepository) {}

    async ejecutar(dto: VeterinarioDTO): Promise<ServiceResponse<Veterinario>> {
        const persona = await this.personaRepo.findOne(dto.numero_persona);
        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada"],
                data: undefined
            };
        };
        
        const errores = validarCreacionVeterinario(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };

        const veterinario = new Veterinario();
        veterinario.persona = persona;
        veterinario.matricula = dto.matricula;
        veterinario.anio_experiencia = dto.anio_experiencia ;

        const nuevoVeterinario = await this.veterinarioRepo.create(veterinario);
        return {
            status: 201,
            success: true,
            messages: ["Veterinario creado correctamente"],
            data: nuevoVeterinario
        };
    };
};