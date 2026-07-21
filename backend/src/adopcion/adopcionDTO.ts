export interface AdopcionDTO {
    nro_adopcion: number;
    dni_adoptante: string;
    nro_animal: number;
    fecha_adopcion: string | Date; // HTTP lo envía como string, luego lo pasamos a Date
    fecha_retiro?: string | Date;
    motivos_retiro?: string;
    evidencia_maltrato?: string;
}