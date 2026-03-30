import { Persona } from "../../entities/persona.entity.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class GetOne{
    constructor(private readonly repo:PersonaRepository){};

    async ejecutar(numero:number):Promise<ServiceResponse<Persona | null>>{
        const persona = await this.repo.findOne(numero);
        if(!persona){
            return {
                success: false,
                status: 404,
                messages: ['Persona no encontrada'],
                data: null
            };
        }
        return {
            success: true,
            status: 200,
            messages: ['Persona encontrada'],
            data: persona
        };
    };
};