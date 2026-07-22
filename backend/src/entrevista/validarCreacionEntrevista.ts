export function validarCreacionEntrevista(dto: any): string[] {
    const errores: string[] = [];

    // 1. Validar Claves Foráneas (Actualizado a DNIs)
    if (!dto.dni_adoptante) {
        errores.push('El DNI del adoptante es obligatorio.');
    } else if (typeof dto.dni_adoptante !== 'string') {
        errores.push('El DNI del adoptante debe ser un texto (string).');
    }

    if (!dto.dni_colaborador) {
        errores.push('El DNI del colaborador es obligatorio.');
    } else if (typeof dto.dni_colaborador !== 'string') {
        errores.push('El DNI del colaborador debe ser un texto (string).');
    }

    // 2. Validar Fechas
    if (!dto.fecha_hora) {
        errores.push('La fecha y hora de la entrevista es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_hora).getTime())) {
        errores.push('La fecha y hora no tiene un formato válido (use ISO 8601, ej: 2026-05-14T10:00:00).');
    }

    /*if (!dto.fecha_hora_rep) {
        errores.push('La fecha y hora de reprogramación es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_hora_rep).getTime())) {
        errores.push('La fecha y hora de reprogramación no tiene un formato válido.');
    }*/

    // 3. Validar Strings y Longitudes (Sincronizado a 20 caracteres)
    if (!dto.estado) {
        errores.push('El estado de la entrevista es obligatorio.');
    } else if (typeof dto.estado !== 'string' || dto.estado.trim().length === 0 || dto.estado.length > 20) {
        errores.push('El estado debe ser un texto válido de máximo 20 caracteres.');
    }

    if (dto.descripcion !== undefined && dto.descripcion !== null) {
        if (typeof dto.descripcion !== 'string' || dto.descripcion.length > 255) {
            errores.push('La descripción debe ser un texto de máximo 255 caracteres.');
        }
    }

    // 4. Validar Booleanos (Ahora es opcional porque la BD tiene default: false)
    if (dto.aprobada !== undefined && dto.aprobada !== null) {
        if (typeof dto.aprobada !== 'boolean') {
            errores.push('El campo aprobada debe ser estrictamente un valor booleano (true o false).');
        }
    }

    return errores;
}