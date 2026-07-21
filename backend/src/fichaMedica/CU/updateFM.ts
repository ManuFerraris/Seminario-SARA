import { FichaMedica } from "../../entities/ficha-medica.entity.js";
import { FichaMedicaRepository } from "../fichaMedica.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { FichaMedicaDTO } from "../fichaMedicaDTO.js";
import { validarActualizacionFichaMedica } from "../../fichaMedica/validarActualizacionFichaMedica.js";

export class UpdateFichaMedica {
    constructor(
        private readonly fichaMedicaRepository: FichaMedicaRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly personaRepository: PersonaRepository
    ) {}

    async ejecutar(numero: number, dto: Partial<FichaMedicaDTO>): Promise<ServiceResponse<FichaMedica>> {
        const errores = validarActualizacionFichaMedica(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const ficha = await this.fichaMedicaRepository.getOneFichaMedica(numero);
        if (!ficha) {
            return { status: 404, success: false, messages: ["Ficha médica no encontrada para actualizar."], data: undefined };
        }

        // Construimos el Partial<FichaMedica> traduciendo IDs a Entidades y strings a Dates
        const datosActualizados: Partial<FichaMedica> = {};

        if (dto.nro_animal !== undefined) {
            const animal = await this.animalRepository.getOne(dto.nro_animal);
            if (!animal) return { status: 404, success: false, messages: ["El nuevo animal indicado no existe."], data: undefined };
            datosActualizados.animal = animal;
        }

        if (dto.dni_veterinario !== undefined) {
            const veterinario = await this.personaRepository.findOne(dto.dni_veterinario);
            if (!veterinario) return { status: 404, success: false, messages: ["El nuevo veterinario indicado no existe."], data: undefined };
            datosActualizados.persona = veterinario;
        }

        if (dto.fecha !== undefined) {
            datosActualizados.fecha = new Date(dto.fecha);
        }

        if (dto.observaciones !== undefined) {
            datosActualizados.observaciones = dto.observaciones;
        }

        await this.fichaMedicaRepository.updateFichaMedica(ficha, datosActualizados);

        return { status: 200, success: true, messages: ["Ficha médica actualizada exitosamente."], data: ficha };
    }
}