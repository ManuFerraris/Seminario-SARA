import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { ColaboradorRepository } from "../../persona/col.repository.js";
import { AdoptanteRepository } from "../../persona/ado.repository.js";
import { validarCreacionEntrevista } from "../validarCreacionEntrevista.js";
import { AnimalRepository } from "../../animal/animal.repository.js";


export class CreateEntrevista {
    constructor(
        private entRepo: EntrevistaRepository,
        private personaRepo: PersonaRepository,
        private colaboradorRepo: ColaboradorRepository,
        private adoptanteRepo: AdoptanteRepository,
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

        const persona = await this.personaRepo.findOne(dto.dni_adoptante);
        if (!persona) {
            return {
                status: 404,
                success: false,
                messages: ["Persona no encontrada."],
                data: undefined
            };
        };
        console.log('Persona encontrada en CU-REGISTRARENTREVISTA:', persona);

        // 2. Buscar a los actores en la tabla Persona unificada
        const colaborador = await this.colaboradorRepo.findOneByPersona(persona);
        if (!colaborador) {
            return {
                status: 404,
                success: false,
                messages: [`No se encontró al colaborador con DNI ${dto.dni_colaborador}`],
                data: undefined
            };
        };
        console.log('Colaborador encontrado en CU-REGISTRARENTREVISTA:', colaborador);

        const adoptante = await this.adoptanteRepo.findOneByPersona(persona);
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