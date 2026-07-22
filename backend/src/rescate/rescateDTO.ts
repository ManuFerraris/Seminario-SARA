export interface RescateDTO {
    nro_rescate: number;
    dni_persona: string;
    nro_animal: number;
    fecha_rescate: Date | string;
    lugar_rescate: string;
}