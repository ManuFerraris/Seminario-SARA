/*
import { Rescatista } from "../../entities/rescatista.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescatistaRepository } from "../rescatista.repository.js";
import { validarCreacionRescatista } from "../validarCreacionRescatista.js";
import { RescatistaDTO } from "../rescatistaDTO.js";

export class CreateRescatista {
    constructor(private rescatistaRepository: RescatistaRepository) {}

    async ejecutar(dto:RescatistaDTO): Promise<ServiceResponse<Rescatista | null>> {
        const errores = validarCreacionRescatista(dto);
        if (errores.length > 0) {
            return {
                status: 404,
                success: false,
                messages: errores,
                data: undefined
            };
        };
        const dniExistente = await this.rescatistaRepository.findOneByDNI(dto.dni);
        if (dniExistente) {
            return {
                status: 409, // Conflicto
                success: false,
                messages: [`El DNI ${dto.dni} ya se encuentra registrado en el sistema.`],
                data: undefined
            };
        };
        
        const nuevoRescatista = new Rescatista();
        nuevoRescatista.dni = dto.dni;
        nuevoRescatista.nombre = dto.nombre;
        nuevoRescatista.apellido = dto.apellido;
        if (dto.telefono) nuevoRescatista.telefono = dto.telefono;

        const rescatistaCreado = await this.rescatistaRepository.createRescatista(nuevoRescatista);
        return {
            status: 201,
            success: true,
            messages: ['Rescatista creado exitosamente.'],
            data: rescatistaCreado
        };
    };
}
*/