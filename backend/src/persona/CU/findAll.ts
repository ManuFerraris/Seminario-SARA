import { Persona } from "../../entities/persona.entity.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class FindAll{
    constructor(private readonly repo:PersonaRepository){};

    async ejecutar():Promise<ServiceResponse<Persona[]>>{
        const personas = await this.repo.findAll();
        return {
            success: true,
            status: 200,
            messages: ['Personas encontradas'],
            data: personas
        };
    };
};