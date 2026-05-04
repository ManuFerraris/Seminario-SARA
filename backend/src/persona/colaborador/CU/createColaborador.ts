import { Colaborador } from "../../../entities/colaborador.entity.js";
import { ColaboradorDTO } from "../colaboradorDTO.js";
import { PersonaRepository } from "../../persona.repository.js";
import { ColaboradorRepository } from "../colaborador.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class CreateColaborador {
    constructor(
        private readonly colaboradorRepo:ColaboradorRepository,
        private readonly personaRepo:PersonaRepository
    ){};

    async ejecutar(dto:ColaboradorDTO):Promise<ServiceResponse<Colaborador>>{

        const colaboradorExistente = await this.colaboradorRepo.findOne(dto.id);
        if(colaboradorExistente){
            return {
                success: false,
                status: 400,
                messages: ['La persona ya es un colaborador'],
                data: undefined
            };
        };

        const persona = await this.personaRepo.findOne(dto.numero_persona);
        if(!persona){
            return {
                success: false,
                status: 404,
                messages: ['Persona no encontrada'],
                data: undefined
            };
        };

        const nuevoColaborador = new Colaborador();
        nuevoColaborador.persona = persona;
        nuevoColaborador.id = dto.id;
        
        const colaboradorCreado = await this.colaboradorRepo.create(nuevoColaborador);
        return {
            success: true,
            status: 201,
            messages: ['Colaborador creado exitosamente'],
            data: colaboradorCreado
        };
    };
}