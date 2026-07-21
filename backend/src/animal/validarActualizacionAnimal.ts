import { AnimalDTO } from "./animalDTO.js";

export async function validarActualizacionAnimal(dto: AnimalDTO): Promise<string[]> {
    const errores: string[] = [];

    // Se usa !== undefined para detectar strings vacíos o ceros enviados intencionalmente
    if(dto.raza !== undefined && (dto.raza.trim().length === 0 || dto.raza.length > 50)) {
        errores.push("El campo 'raza' no puede estar vacío ni tener más de 50 caracteres");
    }
    
    if(dto.especie !== undefined && (dto.especie.trim().length === 0 || dto.especie.length > 50)) {
        errores.push("El campo 'especie' no puede estar vacío ni tener más de 50 caracteres");
    }
    
    if(dto.edad_estimada !== undefined && dto.edad_estimada < 0) {
        errores.push("La edad estimada no puede ser negativa");
    }
    
    if(dto.fecha_ingreso !== undefined && dto.fecha_ingreso > new Date()) {
        errores.push("El campo 'fecha_ingreso' no puede ser una fecha futura");
    }
    
    if(dto.estado !== undefined && !['Disponible', 'No Disponible', 'Adoptado', 'No Adoptado', 'Apto', 'No Apto'].includes(dto.estado)) {
        errores.push("El campo 'estado' debe ser uno de los siguientes valores: 'Disponible', 'No Disponible', 'Adoptado', 'No Adoptado', 'Apto', 'No Apto'");
    }
    
    if(dto.sexo !== undefined && !['Macho', 'Hembra'].includes(dto.sexo)) {
        errores.push("El campo 'sexo' debe ser 'Macho' o 'Hembra'");
    }
    
    if(dto.peso !== undefined && dto.peso < 0) {
        errores.push("El campo 'peso' no puede ser negativo");
    }
    
    if(dto.descripcion !== undefined && dto.descripcion.length > 255) {
        errores.push("El campo 'descripcion' no puede tener más de 255 caracteres");
    }
    
    return errores;
}