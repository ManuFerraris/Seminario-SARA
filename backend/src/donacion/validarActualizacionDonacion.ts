import { DonacionDTO } from "./donacionDTO.js";

export async function validarActualizacionDonacion(dto: DonacionDTO): Promise<string[]> {
    const errores: string[] = [];

    // validar campos obligatorios
    if(dto.cantidad && dto.cantidad < 0) errores.push("El campo 'cantidad' no puede ser negativa");
    if(dto.descripcion && (dto.descripcion.length === 0 || dto.descripcion.length > 255)) errores.push("El campo 'descripcion' es obligatorio y no puede tener más de 255 caracteres`");
    if(dto.tipo && (dto.tipo.length === 0 || dto.tipo.length > 20)) errores.push("El campo 'tipo' es obligatorio y no puede tener más de 20 caracteres`");
    if(dto.fecha_vencimiento && dto.fecha_vencimiento < new Date()) errores.push("El campo 'fecha_vencimiento' no puede ser una fecha pasada");
    
    return errores;
};