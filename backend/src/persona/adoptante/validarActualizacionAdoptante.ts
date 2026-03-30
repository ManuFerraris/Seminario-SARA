import { AdoptanteDTO } from "./adoptanteDTO.js";

export function validarActualizacionAdoptante(dto: AdoptanteDTO): string[] {
    const errores: string[] = [];

    if (dto.estado && dto.estado.length > 15) {
        errores.push("El estado no puede exceder 15 caracteres");
    };

    if (dto.domicilio && dto.domicilio.length > 50) {
        errores.push("El domicilio no puede exceder 50 caracteres");
    };

    return errores;
};