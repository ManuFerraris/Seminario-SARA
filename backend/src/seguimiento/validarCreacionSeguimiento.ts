export function validarCreacionSeguimiento(dto: any): string[] {
    const errores: string[] = [];

    if (!dto.nro_adopcion || typeof dto.nro_adopcion !== 'number' || dto.nro_adopcion <= 0) {
        errores.push('El número de adopción es obligatorio y debe ser un número válido.');
    }

    if (!dto.fecha_seguimiento || isNaN(new Date(dto.fecha_seguimiento).getTime())) {
        errores.push('La fecha de seguimiento es obligatoria y debe tener un formato válido.');
    }

    if (!dto.estado_animal || typeof dto.estado_animal !== 'string' || dto.estado_animal.trim().length === 0) {
        errores.push('El estado del animal es obligatorio.');
    } else if (dto.estado_animal.length > 30) {
        errores.push('El estado del animal no puede exceder los 30 caracteres.');
    }

    if (!dto.entorno || typeof dto.entorno !== 'string' || dto.entorno.trim().length === 0) {
        errores.push('El entorno es obligatorio.');
    } else if (dto.entorno.length > 255) {
        errores.push('El entorno no puede exceder los 255 caracteres.');
    }

    return errores;
}