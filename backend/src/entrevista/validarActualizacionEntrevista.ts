export function validarActualizacionEntrevista(dto: any): string[] {
    const errores: string[] = [];

    // Validar Fecha de Reprogramación
    if (dto.fecha_hora_rep !== undefined) {
        if (isNaN(new Date(dto.fecha_hora_rep).getTime())) {
            errores.push('La fecha y hora de reprogramación no tiene un formato válido (use ISO 8601).');
        }
    }

    // Validar Estado (Sincronizado a 20 caracteres)
    if (dto.estado !== undefined) {
        if (typeof dto.estado !== 'string' || dto.estado.trim().length === 0 || dto.estado.length > 20) {
            errores.push('El estado debe ser un texto válido de máximo 20 caracteres.');
        }
    }

    // Validar Descripción
    if (dto.descripcion !== undefined && dto.descripcion !== null) {
        if (typeof dto.descripcion !== 'string' || dto.descripcion.length > 255) {
            errores.push('La descripción debe ser un texto de máximo 255 caracteres.');
        }
    }

    // Validar Aprobada
    if (dto.aprobada !== undefined) {
        if (typeof dto.aprobada !== 'boolean') {
            errores.push('El campo aprobada debe ser estrictamente un valor booleano (true o false).');
        }
    }

    return errores;
}