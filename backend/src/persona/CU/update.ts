import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarActualizacionPersona } from "../validarActualizacionPersona.js";

export class UpdatePersona{
    constructor(private readonly repo:PersonaRepository){};

    async ejecutar(numero:number, dto:PersonaDTO):Promise<ServiceResponse<Persona>>{
        const persona = await this.repo.findOne(numero);
        if(!persona){
            return {
                success: false,
                status: 404,
                messages: ['Persona no encontrada'],
                data: undefined
            };
        };
        const errores = validarActualizacionPersona(dto);
        if(errores.length > 0){
            return {
                success: false,
                status: 400,
                messages: errores,
                data: undefined
            };
        };

        if(dto.email && dto.email !== persona.email){
            const emailExistente = await this.repo.findByEmail(dto.email);
            if(emailExistente){
                return {
                    success: false,
                    status: 400,
                    messages: ['El email ya está registrado'],
                    data: emailExistente
                };
            }
        };

        if(dto.dni && dto.dni !== persona.dni){
            const dniExistente = await this.repo.findByDNI(dto.dni);
            if(dniExistente){
                return {
                    success: false,
                    status: 400,
                    messages: ['El DNI ya está registrado'],
                    data: dniExistente
                };
            };
        };

        const personaActualizada = await this.repo.update(persona, dto);
        return {
            success: true,
            status: 200,
            messages: ['Persona actualizada exitosamente'],
            data: personaActualizada
        };
    };
};