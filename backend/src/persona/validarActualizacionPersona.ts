import { PersonaDTO } from "./personaDTO.js";

export function validarActualizacionPersona(dto: Partial<PersonaDTO>): string[] {
    const errores: string[] = [];

    if (dto.nombre !== undefined) {
        if (dto.nombre.trim().length === 0) errores.push('El nombre no puede estar vacío.');
        else if (dto.nombre.length > 30) errores.push('El nombre no puede exceder los 30 caracteres.');
    }

    if (dto.apellido !== undefined) {
        if (dto.apellido.trim().length === 0) errores.push('El apellido no puede estar vacío.');
        else if (dto.apellido.length > 30) errores.push('El apellido no puede exceder los 30 caracteres.');
    }

    if (dto.email !== undefined) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) errores.push('El formato del email no es válido.');
        if (dto.email.length > 50) errores.push('El email no puede exceder los 50 caracteres.');
    }

    if (dto.contrasenia !== undefined && dto.contrasenia.length < 8) {
        errores.push('La nueva contraseña debe tener al menos 8 caracteres.');
    }

    if (dto.telefono !== undefined) {
        if (!/^\d{10}$/.test(dto.telefono)) errores.push('El teléfono debe tener exactamente 10 dígitos numéricos.');
    }

    // Validaciones de atributos de herencia
    if (dto.domicilio !== undefined && dto.domicilio.length > 100) {
        errores.push('El domicilio no puede exceder los 100 caracteres.');
    }
    
    if (dto.estado !== undefined && dto.estado.length > 20) {
        errores.push('El estado no puede exceder los 20 caracteres.');
    }
    
    if (dto.matricula !== undefined && dto.matricula.length > 30) {
        errores.push('La matrícula no puede exceder los 30 caracteres.');
    }
    
    if (dto.anios_experiencia !== undefined && dto.anios_experiencia !== null) {
        if (typeof dto.anios_experiencia !== 'number' || dto.anios_experiencia < 0) {
            errores.push('Los años de experiencia deben ser un número válido mayor o igual a 0.');
        }
    }

    return errores;
}