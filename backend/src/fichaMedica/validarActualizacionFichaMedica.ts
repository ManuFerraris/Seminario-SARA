export function validarActualizacionFichaMedica(dto: any): string[] {
    const errores: string[] = [];

    if (dto.nro_animal !== undefined && (typeof dto.nro_animal !== 'number' || dto.nro_animal <= 0)) {
        errores.push('El número de animal debe ser un número válido.');
    }

    if (dto.dni_veterinario !== undefined && (typeof dto.dni_veterinario !== 'string' || dto.dni_veterinario.trim().length === 0)) {
        errores.push('El DNI del veterinario no puede estar vacío.');
    }

    if (dto.fecha !== undefined && isNaN(new Date(dto.fecha).getTime())) {
        errores.push('La fecha no tiene un formato válido.');
    }

    if (dto.observaciones !== undefined && dto.observaciones !== null && (typeof dto.observaciones !== 'string' || dto.observaciones.length > 255)) {
        errores.push('Las observaciones no pueden exceder los 255 caracteres.');
    }

    return errores;
}