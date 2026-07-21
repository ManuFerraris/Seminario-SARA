export function validarActualizacionAdopcion(dto: any): string[] {
    const errores: string[] = [];

    // En la actualización, no permitimos cambiar el animal ni el adoptante. Solo fechas y motivos.
    if (dto.fecha_adopcion !== undefined && isNaN(new Date(dto.fecha_adopcion).getTime())) {
        errores.push('La fecha de adopción no tiene un formato válido.');
    }

    if (dto.fecha_retiro !== undefined && dto.fecha_retiro !== null && isNaN(new Date(dto.fecha_retiro).getTime())) {
        errores.push('La fecha de retiro no tiene un formato válido.');
    }

    if (dto.motivos_retiro !== undefined && dto.motivos_retiro !== null && (typeof dto.motivos_retiro !== 'string' || dto.motivos_retiro.length > 255)) {
        errores.push('Los motivos de retiro no pueden exceder los 255 caracteres.');
    }

    if (dto.evidencia_maltrato !== undefined && dto.evidencia_maltrato !== null && (typeof dto.evidencia_maltrato !== 'string' || dto.evidencia_maltrato.length > 255)) {
        errores.push('La evidencia de maltrato no puede exceder los 255 caracteres.');
    }

    return errores;
}