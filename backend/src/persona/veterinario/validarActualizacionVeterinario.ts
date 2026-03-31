import { VeterinarioDTO } from "./veterinarioDTO.js";

export function validarActualizacionVeterinario(dto: VeterinarioDTO): string[] {
    const errores: string[] = [];

    if (dto.matricula.length > 15) {
        errores.push("La matrícula no puede exceder 15 caracteres");
    };

    if (dto.matricula && dto.matricula.length === 0) {
        errores.push("La matrícula es obligatoria");
    };

    if (dto.anio_experiencia && isNaN(Number(dto.anio_experiencia))) {
        errores.push("El año de experiencia debe ser un número");
    };

    if (dto.anio_experiencia && Number(dto.anio_experiencia) < 0) {
        errores.push("El año de experiencia no puede ser menor a 0");
    };

    return errores;
};