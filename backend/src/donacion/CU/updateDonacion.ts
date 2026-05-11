import { Donacion } from "../../entities/donacion.entity.js";
import { DonacionRepository } from "../donacion.reposiroty.js";
import { DonacionDTO } from "../donacionDTO.js";
import { validarActualizacionDonacion } from "../validarActualizacionDonacion.js";
import { ServiceResponse } from "../../types/service.response.js";

export class UpdateDonacion {
    constructor(private readonly repo:DonacionRepository){};

    async ejecutar(dto:DonacionDTO, numero:number):Promise<ServiceResponse<Donacion>>{
        
        const donacion = await this.repo.buscarDonacionPorNumero(numero);
        if(!donacion) return {
            status: 404,
            success: false,
            messages: [`No se encontró una donación con el número ${numero}.`],
            data: undefined
        };
        
        const errores = await validarActualizacionDonacion(dto);
        if(errores.length > 0) return {
            status: 400, 
            success: false, 
            messages: errores 
        };

        const donacionActualizada = await this.repo.actualizarDonacion(donacion, dto);

        return {
            status: 200,
            success: true,
            messages: [`Donación con número ${numero} actualizada exitosamente.`],
            data: donacionActualizada
        };
    };
};