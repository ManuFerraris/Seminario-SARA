import { AdoptanteDTO } from "./adoptanteDTO.js";
import { validarCodigo } from "../../helpers/validarCodigo.js";

export function validarCreacionAdoptante(dto: AdoptanteDTO): string[] {
    const errores: string[] = [];

    const { valor:codVal, error:codErr } = validarCodigo(dto.numero_persona, 'numero_persona');
    if(codErr || codVal === undefined){
        errores.push(codErr || "Número de persona inválido");
    };

    if (!dto.estado || typeof dto.estado !== 'string') {
        errores.push("El estado es obligatorio y debe ser una cadena de texto.");
    };
    if (dto.estado && dto.estado.length > 15) {
        errores.push("El estado no puede tener más de 15 caracteres.");
    };

    if (!dto.domicilio || typeof dto.domicilio !== 'string') {
        errores.push("El domicilio es obligatorio y debe ser una cadena de texto.");
    };
    if (dto.domicilio && dto.domicilio.length > 50) {
        errores.push("El domicilio no puede tener más de 50 caracteres.");
    };

    return errores;
};