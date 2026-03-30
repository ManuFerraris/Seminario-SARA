import { PersonaDTO } from "./personaDTO.js";

export function validarCreacionPersona(dto: PersonaDTO): string[] {
    const errores: string[] = [];

    if (!dto.dni) errores.push('El DNI es obligatorio');
    if (!dto.nombre) errores.push('El nombre es obligatorio');
    if (!dto.apellido) errores.push('El apellido es obligatorio');
    if (!dto.email) errores.push('El email es obligatorio');
    console.log('Antes de validar constraseña: dto.contrasenia:', dto.contrasenia);
    if (!dto.contrasenia) errores.push('La contraseña es obligatoria');
    if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) errores.push('El email no es válido');
    if (dto.contrasenia && dto.contrasenia.length < 8) errores.push('La contraseña debe tener al menos 8 caracteres');
    if (dto.telefono && !/^\d{10}$/.test(dto.telefono)) errores.push('El teléfono debe tener 10 dígitos');

    return errores;
}