import { Donacion } from "../entities/donacion.entity.js"
import {DonacionDTO} from "./donacionDTO.js";

export interface DonacionRepository {
    buscarDonacionPorNumero(numero: number): Promise<Donacion | null>;
    traerTodasDonaciones(): Promise<Donacion[]>;
    crearDonacion(donacion: DonacionDTO): Promise<Donacion>;
    actualizarDonacion(donacion:Donacion, dto: DonacionDTO): Promise<Donacion>;
    eliminarDonacion(numero: number): Promise<void>;
}