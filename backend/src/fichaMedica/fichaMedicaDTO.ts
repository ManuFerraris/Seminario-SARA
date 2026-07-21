export interface FichaMedicaDTO {
    nro_ficha: number;
    nro_animal: number;
    dni_veterinario: string;
    fecha: Date | string;
    observaciones?: string;
}