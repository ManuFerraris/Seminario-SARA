import { ServiceResponse } from "../../types/service.response.js";
import { DonacionRepository } from "../donacion.reposiroty.js";

export class DeleteDonacion {
    constructor(private readonly repo:DonacionRepository){};
    async ejecutar(numero:number):Promise<ServiceResponse<void>>{
        const donacion = await this.repo.buscarDonacionPorNumero(numero);
        if(!donacion) return {
            status: 404,
            success: false,
            messages: [`No se encontró una donación con el número ${numero}.`],
            data: undefined
        };
        await this.repo.eliminarDonacion(numero);
        return {
            status: 200,
            success: true,
            messages: [`Donación con número ${numero} eliminada exitosamente.`],
            data: undefined
        };
    };
};