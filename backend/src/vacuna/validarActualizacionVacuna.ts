export function validarActualizacionVacuna(dto: any): string[] {
    const errores: string[] = [];

    if (dto.droga !== undefined) {
        if (typeof dto.droga !== 'string' || dto.droga.trim().length === 0) {
            errores.push('El nombre de la droga no puede estar vacío.');
        } else if (dto.droga.length > 255) {
            errores.push('El nombre de la droga no puede exceder los 255 caracteres.');
        }
    }

    if (dto.stock !== undefined) {
        if (typeof dto.stock !== 'number' || dto.stock < 0) {
            errores.push('El stock debe ser un número entero mayor o igual a 0.');
        }
    }

    if (dto.fecha_ingreso !== undefined && isNaN(new Date(dto.fecha_ingreso).getTime())) {
        errores.push('La fecha de ingreso no tiene un formato válido (use ISO 8601).');
    }

    if (dto.fecha_vencimiento !== undefined && isNaN(new Date(dto.fecha_vencimiento).getTime())) {
        errores.push('La fecha de vencimiento no tiene un formato válido (use ISO 8601).');
    }

    return errores;
}