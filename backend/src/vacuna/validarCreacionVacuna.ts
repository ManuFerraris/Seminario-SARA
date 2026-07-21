export function validarCreacionVacuna(dto: any): string[] {
    const errores: string[] = [];

    // Validar Droga
    if (!dto.droga || typeof dto.droga !== 'string' || dto.droga.trim().length === 0) {
        errores.push('El nombre de la droga es obligatorio y no puede estar vacío.');
    } else if (dto.droga.length > 255) {
        errores.push('El nombre de la droga no puede exceder los 255 caracteres.');
    }

    // Validar Stock
    if (dto.stock === undefined || dto.stock === null) {
        errores.push('El stock inicial es obligatorio.');
    } else if (typeof dto.stock !== 'number' || dto.stock < 0) {
        errores.push('El stock debe ser un número entero mayor o igual a 0.');
    }

    // Validar Fechas
    if (!dto.fecha_ingreso) {
        errores.push('La fecha de ingreso es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_ingreso).getTime())) {
        errores.push('La fecha de ingreso no tiene un formato válido (use ISO 8601).');
    }

    if (!dto.fecha_vencimiento) {
        errores.push('La fecha de vencimiento es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_vencimiento).getTime())) {
        errores.push('La fecha de vencimiento no tiene un formato válido (use ISO 8601).');
    }

    return errores;
}