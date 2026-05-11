import { Colaborador } from "../../../entities/colaborador.entity.js";
import { ColaboradorRepository } from "../colaborador.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class GetOneColaborador{
    constructor(private readonly repo:ColaboradorRepository){};

    async ejecutar(id_colaborador: string):Promise<ServiceResponse<Colaborador | null>>{
        const colaborador = await this.repo.findOne(id_colaborador);
        if(!colaborador){
            return {
                success: false,
                status: 404,
                messages: ['Colaborador no encontrado'],
                data: null
            };
        }
        return {
            success: true,
            status: 200,
            messages: ['Colaborador encontrado'],
            data: colaborador
        };
    };
};