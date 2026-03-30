import { Persona } from "../../entities/persona.entity.js";
import { PersonaDTO } from "../personaDTO.js";
import { PersonaRepository } from "../persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionPersona } from "../validarCreacionPersona.js";

export class CreatePersona{
    constructor(private readonly repo:PersonaRepository){};

    async ejecutar(dto:PersonaDTO):Promise<ServiceResponse<Persona>>{

        console.log('DTO recibido en CreatePersona:', dto);
        const errores = validarCreacionPersona(dto);
        if(errores.length > 0){
            return {
                success: false,
                status: 400,
                messages: errores,
                data: undefined
            };
        };

        if(dto.email){
            const emailExistente = await this.repo.findByEmail(dto.email);
            if(emailExistente){
                return {
                    success: false,
                    status: 400,
                    messages: ['El email ya está registrado'],
                    data: emailExistente
                };
            };
        };

        if(dto.dni){
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

        const nuevaPersona = new Persona();
        nuevaPersona.dni = dto.dni;
        nuevaPersona.nombre = dto.nombre;
        nuevaPersona.apellido = dto.apellido;
        nuevaPersona.email = dto.email;
        nuevaPersona.contrasenia = dto.contrasenia;
        if(dto.telefono){
            nuevaPersona.telefono = dto.telefono;
        };

        const personaCreada = await this.repo.create(nuevaPersona);
        return {
            success: true,
            status: 201,
            messages: ['Persona creada exitosamente'],
            data: personaCreada
        };
    };
}