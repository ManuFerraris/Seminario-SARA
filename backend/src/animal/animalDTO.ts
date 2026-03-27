export type estadosAnimal = 'Disponible' | 'No Disponible' | 'Adoptado' | 'No Adoptado' | 'Apto' | 'No Apto';

export interface AnimalDTO {
    numero: number;
    especie: string;
    raza: string;
    edad_estimada: number;
    fecha_ingreso: Date;
    fecha_defuncion?: Date;
    estado: estadosAnimal;
    sexo: 'Macho' | 'Hembra';
    peso: number;
    descripcion: string;
}