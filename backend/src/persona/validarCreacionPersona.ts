import { PersonaDTO } from "./personaDTO.js";

export function validarCreacionPersona(dto: PersonaDTO): string[] {
    const errores: string[] = [];

    // Validaciones de obligatoriedad y longitud para PK
    if (!dto.dni || dto.dni.trim().length === 0) errores.push('El DNI es obligatorio.');
    else if (dto.dni.length > 20) errores.push('El DNI no puede exceder los 20 caracteres.');

    // Validaciones de Nombre y Apellido (Sincronizado a 30 caracteres)
    if (!dto.nombre || dto.nombre.trim().length === 0) errores.push('El nombre es obligatorio.');
    else if (dto.nombre.length > 30) errores.push('El nombre no puede exceder los 30 caracteres.');

    if (!dto.apellido || dto.apellido.trim().length === 0) errores.push('El apellido es obligatorio.');
    else if (dto.apellido.length > 30) errores.push('El apellido no puede exceder los 30 caracteres.');

    // Validación de Email (Regex y límite de 50 caracteres)
    if (!dto.email || dto.email.trim().length === 0) {
        errores.push('El email es obligatorio.');
    } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) errores.push('El formato del email no es válido.');
        if (dto.email.length > 50) errores.push('El email no puede exceder los 50 caracteres.');
    }

    // Validación de Contraseña
    if (!dto.contrasenia || dto.contrasenia.length < 8) {
        errores.push('La contraseña es obligatoria y debe tener al menos 8 caracteres.');
    }

    // Validación de Teléfono (Opcional, pero si viene, estricto a 10 dígitos)
    if (dto.telefono && !/^\d{10}$/.test(dto.telefono)) {
        errores.push('El teléfono debe tener exactamente 10 dígitos numéricos.');
    }

    // Validaciones de atributos de herencia (Opcionales)
    if (dto.domicilio && dto.domicilio.length > 100) errores.push('El domicilio no puede exceder los 100 caracteres.');
    if (dto.estado && dto.estado.length > 20) errores.push('El estado no puede exceder los 20 caracteres.');
    if (dto.matricula && dto.matricula.length > 30) errores.push('La matrícula no puede exceder los 30 caracteres.');
    
    if (dto.anios_experiencia !== undefined && dto.anios_experiencia !== null) {
        if (typeof dto.anios_experiencia !== 'number' || dto.anios_experiencia < 0) {
            errores.push('Los años de experiencia deben ser un número válido mayor o igual a 0.');
        }
    }

    return errores;
}