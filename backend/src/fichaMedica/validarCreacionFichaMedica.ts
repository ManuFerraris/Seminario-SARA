export function validarCreacionFichaMedica(dto: any): string[] {
    const errores: string[] = [];

    if (!dto.nro_animal || typeof dto.nro_animal !== 'number' || dto.nro_animal <= 0) {
        errores.push('El número de animal es obligatorio y debe ser un número válido.');
    }

    if (!dto.dni_veterinario || typeof dto.dni_veterinario !== 'string' || dto.dni_veterinario.trim().length === 0) {
        errores.push('El DNI del veterinario es obligatorio.');
    }

    if (!dto.fecha || isNaN(new Date(dto.fecha).getTime())) {
        errores.push('La fecha es obligatoria y debe tener un formato válido.');
    }

    if (dto.observaciones !== undefined && (typeof dto.observaciones !== 'string' || dto.observaciones.length > 255)) {
        errores.push('Las observaciones no pueden exceder los 255 caracteres.');
    }

    return errores;
}