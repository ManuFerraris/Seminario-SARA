export interface DonacionDTO {
    tipo: string;
    cantidad?: number;
    descripcion?: string;
    fecha_vencimiento: Date;
}