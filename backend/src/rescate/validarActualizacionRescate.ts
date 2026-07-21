export function validarActualizacionRescate(dto: any): string[] {
    const errores: string[] = [];

    // Validar Fecha (si viene en el payload)
    if (dto.fecha_rescate !== undefined) {
        if (isNaN(new Date(dto.fecha_rescate).getTime())) {
            errores.push('La nueva fecha de rescate no tiene un formato válido (use ISO 8601).');
        }
    }

    // Validar Lugar (si viene en el payload)
    if (dto.lugar_rescate !== undefined) {
        if (typeof dto.lugar_rescate !== 'string' || dto.lugar_rescate.trim().length === 0 || dto.lugar_rescate.length > 255) {
            errores.push('El lugar de rescate debe ser un texto de entre 1 y 255 caracteres.');
        }
    }

    return errores;
}