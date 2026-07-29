import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { EntrevistaDTO } from "./../entrevistaDTO.js";
import { validarCreacionEntrevista } from "../validarCreacionEntrevista.js";
import { AnimalRepository } from "../../animal/animal.repository.js";


export class CreateEntrevista {
    constructor(
        private entRepo: EntrevistaRepository,
        private personaRepo: PersonaRepository,
        private animalRepo: AnimalRepository
    ) {}

    async ejecutar(dto: any): Promise<ServiceResponse<Entrevista>> {
        // 1. Validación sintáctica
        console.log('DTO recibido en el caso de uso CreateEntrevista:', dto);
        const errores = validarCreacionEntrevista(dto);
        console.log('Errores de validación:', errores);
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
        console.log('Colaborador encontrado en CU-REGISTRARENTREVISTA:', colaborador);

        const adoptante = await this.personaRepo.findOne(dto.dni_adoptante);
        if (!adoptante) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró al adoptante con DNI ${dto.dni_adoptante}`],
                data: undefined
            };
        }
        console.log('Adoptante encontrado en CU-REGISTRARENTREVISTA:', adoptante);

        const animal = await this.animalRepo.getOne(dto.nro_animal);
        if(!animal){
            return {
                status: 404,
                success: false,
                messages: [`No se encontró al animal con número ${dto.nro_animal}`],
                data: undefined
            };
        }
        console.log('Animal encontrado en CU-REGISTRARENTREVISTA:', animal);

        // 3. Mapeo e instanciación
        
        const nuevaEntrevista = new Entrevista();
        nuevaEntrevista.adoptante = adoptante;
        nuevaEntrevista.colaborador = colaborador;
        nuevaEntrevista.fecha_hora = new Date(dto.fecha_hora);
        if (dto.fecha_hora_rep) {
            nuevaEntrevista.fecha_hora_rep = new Date(dto.fecha_hora_rep);
        }
        nuevaEntrevista.estado = dto.estado;
        nuevaEntrevista.animal = animal;
        
        if (dto.descripcion) nuevaEntrevista.descripcion = dto.descripcion;
        if (dto.aprobada !== undefined) nuevaEntrevista.aprobada = dto.aprobada;

        // 4. Persistencia
        const entrevistaCreada = await this.entRepo.crearEntrevista(nuevaEntrevista);

        console.log('Entrevista creada:', entrevistaCreada);
        return {
            success: true,
            status: 201,
            messages: ["Entrevista creada exitosamente"],
            data: entrevistaCreada
        };
    }
}