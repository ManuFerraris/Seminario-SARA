export function validarCreacionAdopcion(dto: any): string[] {
    const errores: string[] = [];

    if (!dto.dni_adoptante || typeof dto.dni_adoptante !== 'string' || dto.dni_adoptante.trim().length === 0) {
        errores.push('El DNI del adoptante es obligatorio.');
    }

    if (!dto.nro_animal || typeof dto.nro_animal !== 'number' || dto.nro_animal <= 0) {
        errores.push('El número de animal es obligatorio y debe ser válido.');
    }

    if (!dto.fecha_adopcion || isNaN(new Date(dto.fecha_adopcion).getTime())) {
        errores.push('La fecha de adopción es obligatoria y debe tener un formato válido.');
    }

    // Validar opcionales de retiro/maltrato (por si se cargan retroactivamente)
    if (dto.fecha_retiro !== undefined && isNaN(new Date(dto.fecha_retiro).getTime())) {
        errores.push('La fecha de retiro no tiene un formato válido.');
    }

    if (dto.motivos_retiro !== undefined && (typeof dto.motivos_retiro !== 'string' || dto.motivos_retiro.length > 255)) {
        errores.push('Los motivos de retiro no pueden exceder los 255 caracteres.');
    }

    if (dto.evidencia_maltrato !== undefined && (typeof dto.evidencia_maltrato !== 'string' || dto.evidencia_maltrato.length > 255)) {
        errores.push('La evidencia de maltrato no puede exceder los 255 caracteres.');
    }

    return errores;
}