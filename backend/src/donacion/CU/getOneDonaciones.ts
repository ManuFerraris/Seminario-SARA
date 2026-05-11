import { Donacion } from "../../entities/donacion.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { DonacionRepository } from "../donacion.reposiroty.js";

export class GetOneDonacion {
    constructor(private repo: DonacionRepository) {}
    async ejecutar(numero:number): Promise<ServiceResponse<Donacion>> {
        const donacion = await this.repo.buscarDonacionPorNumero(numero);
        if(!donacion){
            return {
                status: 400,
                success: false,
                messages: ["Donación no encontrada"],
                data: undefined
            };
        };
        return {
            status: 200,
            success: true,
            messages: ["Donación encontrada"],
            data: donacion
        };
    };
};