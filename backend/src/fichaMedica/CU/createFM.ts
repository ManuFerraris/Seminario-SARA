import { FichaMedica } from "../../entities/ficha-medica.entity.js";
import { FichaMedicaRepository } from "../fichaMedica.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { FichaMedicaDTO } from "../fichaMedicaDTO.js";
import { validarCreacionFichaMedica } from "../../fichaMedica/validarCreacionFichaMedica.js";

export class CreateFichaMedica {
    constructor(
        private readonly fichaMedicaRepository: FichaMedicaRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly personaRepository: PersonaRepository
    ) {}

    async ejecutar(dto: FichaMedicaDTO): Promise<ServiceResponse<FichaMedica>> {
        const errores = validarCreacionFichaMedica(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const animal = await this.animalRepository.getOne(dto.nro_animal);
        if (!animal) {
            return { status: 404, success: false, messages: ["Animal no encontrado."], data: undefined };
        }

        const veterinario = await this.personaRepository.findOne(dto.dni_veterinario);
        if (!veterinario) {
            return { status: 404, success: false, messages: ["Veterinario no encontrado."], data: undefined };
        }

        const nuevaFicha = new FichaMedica();
        nuevaFicha.animal = animal;
        nuevaFicha.persona = veterinario;
        nuevaFicha.fecha = new Date(dto.fecha);
        if (dto.observaciones) nuevaFicha.observaciones = dto.observaciones.trim();

        await this.fichaMedicaRepository.createFichaMedica(nuevaFicha);

        return { status: 201, success: true, messages: ["Ficha médica registrada exitosamente."], data: nuevaFicha };
    }
}