import { Colaborador } from "../../../entities/colaborador.entity.js";
import { ColaboradorRepository } from "../colaborador.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class FindAllColaborador{
    constructor(private readonly repo:ColaboradorRepository){};

    async ejecutar():Promise<ServiceResponse<Colaborador[]>>{
        const colaboradores = await this.repo.findAll();
        return {
            success: true,
            status: 200,
            messages: ['Colaboradores encontrados'],
            data: colaboradores
        };
    };
};