import { Donacion } from "../entities/donacion.entity.js"

export interface DonacionRepository {
    buscarDonacionPorNumero(numero: number): Promise<Donacion | null>;
    traerTodasDonaciones(): Promise<Donacion[]>;
    crearDonacion(donacion: Donacion): Promise<Donacion>;
    actualizarDonacion(donacion:Donacion, dto: Partial<Donacion>): Promise<Donacion>;
    eliminarDonacion(numero: number): Promise<void>;
}