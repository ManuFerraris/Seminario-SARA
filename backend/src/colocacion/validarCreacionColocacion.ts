export function validarCreacionColocacion(dto: any): string[] {
    const errores: string[] = [];

    if (!dto.nro_ficha || typeof dto.nro_ficha !== 'number' || dto.nro_ficha <= 0) {
        errores.push('El número de ficha médica es obligatorio y debe ser un número válido.');
    }

    if (!dto.nro_vacuna || typeof dto.nro_vacuna !== 'number' || dto.nro_vacuna <= 0) {
        errores.push('El número de vacuna es obligatorio y debe ser un número válido.');
    }

    if (!dto.fecha_colocacion || isNaN(new Date(dto.fecha_colocacion).getTime())) {
        errores.push('La fecha de colocación es obligatoria y debe tener un formato válido.');
    }

    if (!dto.cantidad || typeof dto.cantidad !== 'number' || dto.cantidad <= 0) {
        errores.push('La cantidad es obligatoria y debe ser mayor a cero.');
    }

    return errores;
}