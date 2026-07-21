export function validarActualizacionSeguimiento(dto: any): string[] {
    const errores: string[] = [];

    if (dto.nro_adopcion !== undefined && (typeof dto.nro_adopcion !== 'number' || dto.nro_adopcion <= 0)) {
        errores.push('El número de adopción debe ser un número válido.');
    }

    if (dto.fecha_seguimiento !== undefined && isNaN(new Date(dto.fecha_seguimiento).getTime())) {
        errores.push('La fecha de seguimiento no tiene un formato válido.');
    }

    if (dto.estado_animal !== undefined) {
        if (typeof dto.estado_animal !== 'string' || dto.estado_animal.trim().length === 0) {
            errores.push('El estado del animal no puede estar vacío.');
        } else if (dto.estado_animal.length > 30) {
            errores.push('El estado del animal no puede exceder los 30 caracteres.');
        }
    }

    if (dto.entorno !== undefined) {
        if (typeof dto.entorno !== 'string' || dto.entorno.trim().length === 0) {
            errores.push('El entorno no puede estar vacío.');
        } else if (dto.entorno.length > 255) {
            errores.push('El entorno no puede exceder los 255 caracteres.');
        }
    }

    return errores;
}