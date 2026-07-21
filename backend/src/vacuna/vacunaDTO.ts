export interface VacunaDTO {
    nro_vacuna: number;
    fecha_vencimiento: string | Date;
    droga: string;
    stock: number;
    fecha_ingreso: string | Date;
}