import { Adopcion } from "../../entities/adopcion.entity.js";
import { AdopcionRepository } from "./../adopcion.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { AdopcionDTO } from "../adopcionDTO.js";
import { validarCreacionAdopcion } from "../validarCreacionAdopcion.js";
import { ServiceResponse } from "../../types/service.response.js";

export class CreateAdopcion {
    constructor(
        private readonly adopcionRepository: AdopcionRepository,
        private readonly personaRepository: PersonaRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async ejecutar(dto: AdopcionDTO): Promise<ServiceResponse<Adopcion>> {
        // 1. Validación Síncrona
        const errores = validarCreacionAdopcion(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const fechaAdopcion = new Date(dto.fecha_adopcion);
        let fechaRetiro: Date | undefined = undefined;

        if (dto.fecha_retiro) {
            fechaRetiro = new Date(dto.fecha_retiro);
            if (fechaRetiro.getTime() < fechaAdopcion.getTime()) {
                return { status: 400, success: false, messages: ["La fecha de retiro no puede ser anterior a la de adopción."], data: undefined };
            }
        }

        // 2. Validación Asíncrona (Existencia)
        const persona = await this.personaRepository.findOne(dto.dni_adoptante);
        if (!persona) {
            return { status: 404, success: false, messages: ["Adoptante no encontrado con el DNI provisto."], data: undefined };
        }

        const animal = await this.animalRepository.getOne(dto.nro_animal);
        if (!animal) {
            return { status: 404, success: false, messages: ["Animal no encontrado."], data: undefined };
        }

        // 3. Creación
        const nuevaAdopcion = new Adopcion();
        nuevaAdopcion.adoptante = persona;
        nuevaAdopcion.animal = animal;
        nuevaAdopcion.fecha_adopcion = fechaAdopcion;
        if (fechaRetiro) nuevaAdopcion.fecha_retiro = fechaRetiro;
        if (dto.motivos_retiro) nuevaAdopcion.motivos_retiro = dto.motivos_retiro.trim();
        if (dto.evidencia_maltrato) nuevaAdopcion.evidencia_maltrato = dto.evidencia_maltrato.trim();

        await this.adopcionRepository.createAdopcion(nuevaAdopcion);

        return { status: 201, success: true, messages: ["Adopción registrada exitosamente."], data: nuevaAdopcion };
    }
}