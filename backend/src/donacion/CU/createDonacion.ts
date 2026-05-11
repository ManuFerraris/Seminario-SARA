import { Donacion } from "../../entities/donacion.entity.js";
import { DonacionDTO } from "../donacionDTO.js";
import { DonacionRepository } from "../donacion.reposiroty.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionDonacion } from "../validarCreacionDonacion.js";

export class CreateDonacion {
    constructor(private repo:DonacionRepository){};
    async ejecutar(dto:DonacionDTO):Promise<ServiceResponse<Donacion>>{
        const errores = validarCreacionDonacion(dto);
        if(errores.length > 0){
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        };

        const nuevaDonacion = new Donacion();
        nuevaDonacion.tipo = dto.tipo;
        if(dto.cantidad) nuevaDonacion.cantidad = dto.cantidad;
        if(dto.descripcion) nuevaDonacion.descripcion = dto.descripcion;
        nuevaDonacion.fecha_vencimiento = dto.fecha_vencimiento;

        const donacionCreada = await this.repo.crearDonacion(nuevaDonacion);
        return {
            status: 201,
            success: true,
            messages: ["Donación creada exitosamente"],
            data: donacionCreada
        };
    };
};