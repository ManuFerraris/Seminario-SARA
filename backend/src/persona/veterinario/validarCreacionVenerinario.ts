import { VeterinarioDTO } from "./veterinarioDTO.js";
import { validarCodigo } from "../../helpers/validarCodigo.js";

export function validarCreacionVeterinario(dto: VeterinarioDTO): string[] {
    const errores: string[] = [];

    const {valor: codVal, error} = validarCodigo(dto.numero_persona, 'numero_persona');
    if (error || codVal === undefined) {
        errores.push(error || "Número de persona inválido");
    };

    if (!dto.matricula) {
        errores.push("La matrícula es obligatoria");
    };
    if (dto.matricula && dto.matricula.length > 15) {
        errores.push("La matrícula no puede exceder 15 caracteres");
    };

    if (!dto.anio_experiencia) {
        errores.push("El año de experiencia es obligatorio");
    };
    if (dto.anio_experiencia && isNaN(Number(dto.anio_experiencia))) {
        errores.push("El año de experiencia debe ser un número");
    };
    if (dto.anio_experiencia && Number(dto.anio_experiencia) < 0) {
        errores.push("El año de experiencia no puede ser menor a 0");
    };

    return errores;
}