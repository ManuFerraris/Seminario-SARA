export function validarCreacionRescate(dto: any): string[] {
    const errores: string[] = [];

    // 1. Validar Claves Foráneas
    if (!dto.dni_persona) {
        errores.push('El DNI de la persona (rescatista) es obligatorio.');
    } else if (typeof dto.dni_persona !== 'string' || dto.dni_persona.trim().length === 0) {
        errores.push('El DNI de la persona debe ser un texto válido.');
    }

    if (!dto.nro_animal) {
        errores.push('El número de animal es obligatorio.');
    } else if (typeof dto.nro_animal !== 'number' || dto.nro_animal <= 0) {
        errores.push('El número de animal debe ser un valor numérico positivo.');
    }

    // 2. Validar Fecha
    if (!dto.fecha_rescate) {
        errores.push('La fecha de rescate es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_rescate).getTime())) {
        errores.push('La fecha de rescate no tiene un formato válido (use ISO 8601).');
    }

    // 3. Validar Strings y Longitudes
    if (!dto.lugar_rescate) {
        errores.push('El lugar de rescate es obligatorio.');
    } else if (typeof dto.lugar_rescate !== 'string' || dto.lugar_rescate.trim().length === 0 || dto.lugar_rescate.length > 255) {
        errores.push('El lugar de rescate debe ser un texto de entre 1 y 255 caracteres.');
    }

    return errores;
}