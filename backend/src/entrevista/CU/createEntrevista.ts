import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { EntrevistaDTO } from "./../entrevistaDTO.js";
import { validarCreacionEntrevista } from "../validarCreacionEntrevista.js";


export class CreateEntrevista {
    constructor(
        private entRepo: EntrevistaRepository,
        private personaRepo: PersonaRepository
    ) {}

    async ejecutar(dto: EntrevistaDTO): Promise<ServiceResponse<Entrevista>> {
        // 1. Validación sintáctica
        const errores = validarCreacionEntrevista(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        // 2. Buscar a los actores en la tabla Persona unificada
        const colaborador = await this.personaRepo.findOne(dto.dni_colaborador);
        if (!colaborador) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró al colaborador con DNI ${dto.dni_colaborador}`],
                data: undefined
            };
        }

        const adoptante = await this.personaRepo.findOne(dto.dni_adoptante);
        if (!adoptante) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró al adoptante con DNI ${dto.dni_adoptante}`],
                data: undefined
            };
        }

        // 3. Mapeo e instanciación
        const nuevaEntrevista = new Entrevista();
        nuevaEntrevista.adoptante = adoptante;
        nuevaEntrevista.colaborador = colaborador;
        nuevaEntrevista.fecha_hora = new Date(dto.fecha_hora);
        nuevaEntrevista.fecha_hora_rep = new Date(dto.fecha_hora_rep);
        nuevaEntrevista.estado = dto.estado;
        
        if (dto.descripcion) nuevaEntrevista.descripcion = dto.descripcion;
        if (dto.aprobada !== undefined) nuevaEntrevista.aprobada = dto.aprobada;

        // 4. Persistencia
        const entrevistaCreada = await this.entRepo.crearEntrevista(nuevaEntrevista);

        return {
            success: true,
            status: 201,
            messages: ["Entrevista creada exitosamente"],
            data: entrevistaCreada
        };
    }
}