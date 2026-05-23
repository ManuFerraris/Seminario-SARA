export function validarActualizacionEntrevista(dto: any): string[] {
    const errores: string[] = [];

    // Validar Fecha de Reprogramación (si viene en el payload)
    if (dto.fecha_hora_rep) {
        if (isNaN(new Date(dto.fecha_hora_rep).getTime())) {
            errores.push('La fecha y hora de reprogramación no tiene un formato válido (use ISO 8601).');
        }
    }

    // Validar Estado (si viene en el payload)
    if (dto.estado !== undefined) {
        if (typeof dto.estado !== 'string' || dto.estado.length > 15) {
            errores.push('El estado debe ser un texto de máximo 15 caracteres.');
        }
    }

    // Validar Descripción (si viene en el payload, permitimos que sea null para borrarla)
    if (dto.descripcion !== undefined && dto.descripcion !== null) {
        if (typeof dto.descripcion !== 'string' || dto.descripcion.length > 255) {
            errores.push('La descripción debe ser un texto de máximo 255 caracteres.');
        }
    }

    // Validar Aprobada (si viene en el payload)
    if (dto.aprobada !== undefined) {
        if (typeof dto.aprobada !== 'boolean') {
            errores.push('El campo aprobada debe ser estrictamente un valor booleano (true o false).');
        }
    }

    return errores;
}