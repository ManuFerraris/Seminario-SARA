/*
import { RescatistaDTO } from "./rescatistaDTO.js";

export function validarCreacionRescatista(dto: RescatistaDTO): string[] {
    const errores: string[] = [];
    if (!dto.dni) errores.push('El DNI es obligatorio');
    if (!dto.nombre) errores.push('El nombre es obligatorio');
    if (!dto.apellido) errores.push('El apellido es obligatorio');

    if (dto.nombre && (dto.nombre.length < 0  || dto.nombre.length > 20)) errores.push('El nombre debe tener entre 1 y 20 caracteres');
    if (dto.apellido && (dto.apellido.length < 0  || dto.apellido.length > 20)) errores.push('El apellido debe tener entre 1 y 20 caracteres');
    if (dto.dni && (dto.dni <= 0 || dto.dni > 99999999)) errores.push('El DNI no es válido');

    if (dto.telefono && !/^\d{13}$/.test(dto.telefono)) errores.push('El teléfono debe tener 13 dígitos');
    return errores;
}
*/