export function validarActualizacionColocacion(dto: any): string[] {
    const errores: string[] = [];

    if (dto.nro_ficha !== undefined && (typeof dto.nro_ficha !== 'number' || dto.nro_ficha <= 0)) {
        errores.push('El número de ficha médica debe ser un número válido.');
    }

    if (dto.nro_vacuna !== undefined && (typeof dto.nro_vacuna !== 'number' || dto.nro_vacuna <= 0)) {
        errores.push('El número de vacuna debe ser un número válido.');
    }

    if (dto.fecha_colocacion !== undefined && isNaN(new Date(dto.fecha_colocacion).getTime())) {
        errores.push('La fecha de colocación no tiene un formato válido.');
    }

    if (dto.cantidad !== undefined && (typeof dto.cantidad !== 'number' || dto.cantidad <= 0)) {
        errores.push('La cantidad debe ser mayor a cero.');
    }

    return errores;
}