import { DonacionDTO } from "./donacionDTO.js"; // Ajusta el path

export function validarCreacionDonacion(dto: DonacionDTO): string[] {
    const errores: string[] = [];
    
    // Campos obligatorios
    if (!dto.tipo) errores.push("El tipo de donación es obligatorio");
    if (!dto.dni_donante) errores.push("El DNI del donante es obligatorio");
    if (dto.cantidad === undefined || dto.cantidad === null) errores.push("La cantidad es obligatoria");
    
    // Validaciones de formato y lógica
    if (dto.cantidad !== undefined && dto.cantidad <= 0) errores.push("La cantidad debe ser mayor a 0");
    if (dto.tipo && dto.tipo.length > 30) errores.push("El campo 'tipo' no puede tener más de 30 caracteres");
    if (dto.descripcion && dto.descripcion.length > 255) errores.push("El campo 'descripcion' no puede tener más de 255 caracteres");
    
    // OJO: La fecha de vencimiento es opcional, solo la validamos si la envían
    if (dto.fecha_vencimiento && new Date(dto.fecha_vencimiento) < new Date()) {
        errores.push("La fecha de vencimiento no puede ser una fecha pasada");
    }

    return errores;
}