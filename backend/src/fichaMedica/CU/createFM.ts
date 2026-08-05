import { FichaMedica } from "../../entities/ficha-medica.entity.js";
import { FichaMedicaRepository } from "../fichaMedica.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { FichaMedicaDTO } from "../fichaMedicaDTO.js";
import { validarCreacionFichaMedica } from "../../fichaMedica/validarCreacionFichaMedica.js";
import { VeterinarioRepository } from "../../persona/vet.repository.js";

export class CreateFichaMedica {
    constructor(
        private readonly fichaMedicaRepository: FichaMedicaRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly personaRepository: PersonaRepository,
        private readonly veterinarioRepo: VeterinarioRepository
    ) {}

    async ejecutar(dto: any): Promise<ServiceResponse<FichaMedica>> {
        dto.fecha = new Date();
        const errores = validarCreacionFichaMedica(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const animal = await this.animalRepository.getOne(dto.nro_animal);
        if (!animal) {
            return { status: 404, success: false, messages: ["Animal no encontrado."], data: undefined };
        }

        const persona = await this.personaRepository.findOne(dto.dni_veterinario);
        if (!persona) {
            return { status: 404, success: false, messages: ["Persona no encontrada."], data: undefined };
        }

        const veterinario = await this.veterinarioRepo.findOneByPersona(persona);
        if (!veterinario) {
            return { status: 404, success: false, messages: ["Veterinario no encontrado."], data: undefined };
        }

        const animalActualizado = await this.animalRepository.cambiarEstado(animal, dto.estado || 'Apto para vacunar');
        if (!animalActualizado) {
            return { status: 500, success: false, messages: ["Error al actualizar el estado del animal."], data: undefined };
        }

        const nuevaFicha = new FichaMedica();
        nuevaFicha.animal = animalActualizado;
        nuevaFicha.veterinario = veterinario;
        nuevaFicha.fecha = new Date(dto.fecha);
        if (dto.observaciones) nuevaFicha.observaciones = dto.observaciones.trim();

        await this.fichaMedicaRepository.createFichaMedica(nuevaFicha);

        return { status: 201, success: true, messages: ["Ficha médica registrada exitosamente."], data: nuevaFicha };
    }
}