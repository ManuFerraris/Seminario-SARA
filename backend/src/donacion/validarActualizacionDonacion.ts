import { DonacionDTO } from "./donacionDTO.js";

export async function validarActualizacionDonacion(dto: DonacionDTO): Promise<string[]> {
    const errores: string[] = [];

    if (dto.cantidad !== undefined && dto.cantidad <= 0) {
        errores.push("La cantidad debe ser mayor a 0");
    }
    
    if (dto.descripcion !== undefined && (dto.descripcion.trim().length === 0 || dto.descripcion.length > 255)) {
        errores.push("El campo 'descripcion' no puede estar vacío ni tener más de 255 caracteres");
    }
    
    if (dto.tipo !== undefined && (dto.tipo.trim().length === 0 || dto.tipo.length > 30)) {
        errores.push("El campo 'tipo' no puede estar vacío ni tener más de 30 caracteres");
    }
    
    if (dto.fecha_vencimiento && new Date(dto.fecha_vencimiento) < new Date()) {
        errores.push("La fecha de vencimiento no puede ser una fecha pasada");
    }
    
    return errores;
}