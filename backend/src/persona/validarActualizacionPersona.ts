import { PersonaDTO } from "./personaDTO.js";

export function validarActualizacionPersona(dto: PersonaDTO): string[] {
    const errores: string[] = [];
    if (dto.nombre && (dto.nombre.length < 0  || dto.nombre.length > 20)) errores.push('El nombre debe tener entre 1 y 20 caracteres');
    if (dto.apellido && (dto.apellido.length < 0  || dto.apellido.length > 20)) errores.push('El apellido debe tener entre 1 y 20 caracteres');
    if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) errores.push('El email no es válido');
    if (dto.contrasenia && dto.contrasenia.length < 8) errores.push('La contraseña debe tener al menos 8 caracteres');
    if (dto.telefono && !/^\d{10}$/.test(dto.telefono)) errores.push('El teléfono debe tener 10 dígitos');
    return errores;
}