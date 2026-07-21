import { AnimalDTO } from "./animalDTO.js";

export async function validarCreacionAnimal(dto: AnimalDTO): Promise<string[]> {
    const errores: string[] = [];

    // Validar campos obligatorios
    if(!dto.raza) errores.push("El campo 'raza' es obligatorio");
    if(!dto.especie) errores.push("El campo 'especie' es obligatorio");
    if(dto.edad_estimada === undefined) errores.push("El campo 'edad_estimada' es obligatorio");
    if(!dto.fecha_ingreso) errores.push("El campo 'fecha_ingreso' es obligatorio");
    if(!dto.estado) errores.push("El campo 'estado' es obligatorio");
    if(!dto.sexo) errores.push("El campo 'sexo' es obligatorio");
    if(dto.peso === undefined) errores.push("El campo 'peso' es obligatorio");
    
    // Validaciones de formato (Sincronizado a 50 caracteres)
    if(dto.raza && dto.raza.length > 50) errores.push("El campo 'raza' no puede tener más de 50 caracteres");
    if(dto.especie && dto.especie.length > 50) errores.push("El campo 'especie' no puede tener más de 50 caracteres");
    
    if(dto.edad_estimada !== undefined && dto.edad_estimada < 0) errores.push("El campo 'edad_estimada' no puede ser negativo");
    if(dto.fecha_ingreso && dto.fecha_ingreso > new Date()) errores.push("El campo 'fecha_ingreso' no puede ser una fecha futura");
    
    if(dto.estado && !['Disponible', 'No Disponible', 'Adoptado', 'No Adoptado', 'Apto', 'No Apto'].includes(dto.estado)) {
        errores.push("El campo 'estado' debe ser uno de los siguientes valores: 'Disponible', 'No Disponible', 'Adoptado', 'No Adoptado', 'Apto', 'No Apto'");
    }
    
    if(dto.sexo && !['Macho', 'Hembra'].includes(dto.sexo)) {
        errores.push("El campo 'sexo' debe ser 'Macho' o 'Hembra'");
    }
    
    if(dto.peso !== undefined && dto.peso < 0) errores.push("El campo 'peso' no puede ser negativo");
    if(dto.descripcion && dto.descripcion.length > 255) errores.push("El campo 'descripcion' no puede tener más de 255 caracteres");
    
    return errores;
}