export interface DonacionDTO {
    nro_donacion: number;
    tipo: string;
    cantidad: number;
    descripcion?: string;
    fecha_vencimiento?: Date;
    dni_donante: string;
}