import { Adopcion } from "../../entities/adopcion.entity.js";
import { AdopcionRepository } from "./../adopcion.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { AdoptanteRepository } from "../../persona/ado.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { SeguimientoRepository } from "../../seguimiento/seg.repository.js";
import { AdopcionDTO } from "../adopcionDTO.js";
import { validarCreacionAdopcion } from "../validarCreacionAdopcion.js";
import { ServiceResponse } from "../../types/service.response.js";
import { Seguimiento } from "../../entities/seguimiento.entity.js";

export class CreateAdopcion {
    constructor(
        private readonly adopcionRepository: AdopcionRepository,
        private readonly personaRepository: PersonaRepository,
        private readonly adoptanteRepository: AdoptanteRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly seguimientoRepository: SeguimientoRepository
    ) {}

    async ejecutar(dto: AdopcionDTO): Promise<ServiceResponse<Adopcion>> {

        dto.fecha_adopcion = new Date();
        const errores = validarCreacionAdopcion(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const fechaAdopcion = new Date();
        let fechaRetiro: Date | undefined = undefined;

        if (dto.fecha_retiro) {
            fechaRetiro = new Date(dto.fecha_retiro);
            if (fechaRetiro.getTime() < fechaAdopcion.getTime()) {
                return { status: 400, success: false, messages: ["La fecha de retiro no puede ser anterior a la de adopción."], data: undefined };
            }
        }

        const persona = await this.personaRepository.findOne(dto.dni_adoptante);
        if (!persona) {
            return { status: 404, success: false, messages: ["Adoptante no encontrado con el DNI provisto."], data: undefined };
        }

        const adoptante = await this.adoptanteRepository.findOneByPersona(persona);
        if (!adoptante) {
            return { status: 404, success: false, messages: ["Adoptante no encontrado."], data: undefined };
        };

        const animal = await this.animalRepository.getOne(dto.nro_animal);
        if (!animal) {
            return { status: 404, success: false, messages: ["Animal no encontrado."], data: undefined };
        }

        const tieneVacunas = animal.fichas_medicas.getItems().some(ficha => ficha.colocaciones.getItems().length > 0);

        if (!tieneVacunas) {
            return { status: 400, success: false, messages: ["Adopción bloqueada. El animal no posee las vacunas al día."], data: undefined };
        }

        // Creación y actualización de estado
        const nuevaAdopcion = new Adopcion();
        nuevaAdopcion.adoptante = adoptante;
        nuevaAdopcion.animal = animal;
        nuevaAdopcion.fecha_adopcion = fechaAdopcion;
        if (fechaRetiro) nuevaAdopcion.fecha_retiro = fechaRetiro;
        if (dto.motivos_retiro) nuevaAdopcion.motivos_retiro = dto.motivos_retiro.trim();
        if (dto.evidencia_maltrato) nuevaAdopcion.evidencia_maltrato = dto.evidencia_maltrato.trim();
        animal.estado = 'Adoptado';

        await this.adopcionRepository.createAdopcion(nuevaAdopcion);

        //Creamos las 4 instancias de seguimiento con estado "Pendiente"
        for (let i = 1; i <= 4; i++) {
            const seguimiento = new Seguimiento();
            seguimiento.adopcion = nuevaAdopcion;
            // Fecha para el 1 de cada mes, comenzando desde el mes siguiente a la fecha de adopción
            const fechaSeguimiento = new Date(fechaAdopcion);
            fechaSeguimiento.setMonth(fechaSeguimiento.getMonth() + i);
            seguimiento.fecha_seguimiento = fechaSeguimiento;
            seguimiento.entorno = '';
            seguimiento.estado_animal = '';
            await this.seguimientoRepository.createSeguimiento(seguimiento);
        }

        return { status: 201, success: true, messages: ["Adopción registrada exitosamente."], data: nuevaAdopcion };
    }
}