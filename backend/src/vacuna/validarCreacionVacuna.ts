export function validarCreacionVacuna(dto: any): string[] {
    const errores: string[] = [];

    if (!dto.droga) {
        errores.push('El nombre de la droga es obligatorio.');
    } else if (typeof dto.droga !== 'string' || dto.droga.length > 255) {
        errores.push('La droga debe ser un texto de máximo 255 caracteres.');
    }

    if (dto.stock === undefined || dto.stock === null) {
        errores.push('El stock es obligatorio.');
    } else if (typeof dto.stock !== 'number' || dto.stock < 0) {
        // No podemos ingresar una vacuna con stock negativo
        errores.push('El stock debe ser un número entero mayor o igual a cero.');
    }

    if (!dto.fecha_ingreso) {
        errores.push('La fecha de ingreso es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_ingreso).getTime())) {
        errores.push('La fecha de ingreso no tiene un formato válido (use ISO 8601).');
    }

    if (!dto.fecha_vencimiento) {
        errores.push('La fecha de vencimiento es obligatoria.');
    } else if (isNaN(new Date(dto.fecha_vencimiento).getTime())) {
        errores.push('La fecha de vencimiento no tiene un formato válido (use ISO 8601).');
    }

    // Validación de Lógica de Negocio (Cronología)
    if (dto.fecha_ingreso && dto.fecha_vencimiento) {
        const ingreso = new Date(dto.fecha_ingreso);
        const vencimiento = new Date(dto.fecha_vencimiento);
        
        if (vencimiento <= ingreso) {
            errores.push('La fecha de vencimiento debe ser estrictamente posterior a la fecha de ingreso.');
        }
    }
    return errores;
}