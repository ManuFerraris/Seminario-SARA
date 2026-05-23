export interface EntrevistaDTO {
    numero_adoptante: number;
    numero_colaborador: number;
    fecha_hora: string | Date; // HTTP lo envía como string, luego lo pasamos a Date
    fecha_hora_rep: string | Date;
    estado: string;
    descripcion?: string;
    aprobada: boolean;
}