export interface EntrevistaDTO {
    id_entrevista: number;
    dni_adoptante: string;
    dni_colaborador: string;
    fecha_hora: string | Date; // HTTP lo envía como string, luego lo pasamos a Date
    fecha_hora_rep: string | Date;
    estado: string;
    descripcion?: string;
    aprobada: boolean;
}