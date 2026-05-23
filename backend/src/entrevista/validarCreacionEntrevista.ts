import { EntrevistaDTO } from "./entrevistaDTO.js";

export function validarCreacionEntrevista(dto: any): string[] {
    const errores: string[] = [];

    // 1. Validar Claves Foráneas (IDs)
    if (!dto.numero_adoptante) {
        errores.push('El número de adoptante es obligatorio.');
    } else if (typeof dto.numero_adoptante !== 'number') {
        errores.push('El número de adoptante debe ser un valor numérico.');
    }

    if (!dto.id_colaborador) {
        errores.push('El ID de colaborador es obligatorio.');
    } else if (typeof dto.id_colaborador !== 'string') {
        errores.push('El ID de colaborador debe ser un valor de tipo string.');
    }

    // 2. Validar Fechas (Transformamos el string del JSON a Date para verificar que sea válido)
    if (!dto.fecha_hora) {
        errores.push('La fecha y hora de la entrevista es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_hora).getTime())) {
        errores.push('La fecha y hora no tiene un formato válido (use ISO 8601, ej: 2026-05-14T10:00:00).');
    }

    if (!dto.fecha_hora_rep) {
        errores.push('La fecha y hora de reprogramación es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_hora_rep).getTime())) {
        errores.push('La fecha y hora de reprogramación no tiene un formato válido.');
    }

    // 3. Validar Strings y Longitudes (Basado en tu entidad)
    if (!dto.estado) {
        errores.push('El estado de la entrevista es obligatorio.');
    } else if (typeof dto.estado !== 'string' || dto.estado.length > 15) {
        errores.push('El estado debe ser un texto de máximo 15 caracteres.');
    }

    if (dto.descripcion !== undefined && dto.descripcion !== null) {
        if (typeof dto.descripcion !== 'string' || dto.descripcion.length > 255) {
            errores.push('La descripción debe ser un texto de máximo 255 caracteres.');
        }
    }

    // 4. Validar Booleanos
    if (dto.aprobada === undefined || dto.aprobada === null) {
        errores.push('El campo aprobada es obligatorio.');
    } else if (typeof dto.aprobada !== 'boolean') {
        errores.push('El campo aprobada debe ser estrictamente un valor booleano (true o false).');
    }

    return errores;
}