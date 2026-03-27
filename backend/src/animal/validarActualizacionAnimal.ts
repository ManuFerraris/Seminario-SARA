import { AnimalDTO } from "./animalDTO.js";

export async function validarActualizacionAnimal(dto: AnimalDTO): Promise<string[]> {
    const errores: string[] = [];

    // validar campos obligatorios
    if(dto.raza && (dto.raza.length === 0 || dto.raza.length > 20)) errores.push("El campo 'raza' es obligatorio y no puede tener más de 20 caracteres`");
    if(dto.especie && (dto.especie.length === 0 || dto.especie.length > 20)) errores.push("El campo 'especie' es obligatorio y no puede tener más de 20 caracteres`");
    if(dto.edad_estimada && (dto.edad_estimada < 0)) errores.push("La edad estimada no puede ser negativa");
    if(dto.fecha_ingreso && dto.fecha_ingreso > new Date()) errores.push("El campo 'fecha_ingreso' no puede ser una fecha futura");
    if(dto.estado && !['Disponible', 'No Disponible', 'Adoptado', 'No Adoptado', 'Apto', 'No Apto'].includes(dto.estado)) {
        errores.push("El campo 'estado' debe ser uno de los siguientes valores: 'Disponible', 'No Disponible', 'Adoptado', 'No Adoptado', 'Apto', 'No Apto'");
    };
    if(dto.sexo && !['Macho', 'Hembra'].includes(dto.sexo)) {
        errores.push("El campo 'sexo' debe ser 'Macho' o 'Hembra'");
    };
    if(dto.peso && dto.peso < 0) errores.push("El campo 'peso' no puede ser negativo");
    if(dto.descripcion && dto.descripcion.length > 255) errores.push("El campo 'descripcion' no puede tener más de 255 caracteres");
    
    return errores;
};