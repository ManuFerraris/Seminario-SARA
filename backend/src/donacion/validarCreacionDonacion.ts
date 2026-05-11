import { DonacionDTO } from "./donacionDTO.js";

export function validarCreacionDonacion(dto: DonacionDTO): string[] {
    const errores: string[] = [];
    if (!dto.tipo) errores.push('El tipo de donación es obligatorio');
    if (!dto.fecha_vencimiento) errores.push('La fecha de vencimiento es obligatoria');
    return errores;
};