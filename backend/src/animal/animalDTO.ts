export type estadosAnimal = "No Apto" | "Disponible" | "No Disponible" | "Reservado" | "Adoptado" | "Fallecido";

export interface AnimalDTO {
    nro_animal: number;
    especie: string;
    raza: string;
    edad_estimada: number;
    fecha_ingreso: Date;
    fecha_defuncion?: Date;
    estado: estadosAnimal;
    sexo: 'Macho' | 'Hembra';
    peso: number;
    descripcion?: string;
}