import { Colaborador } from "../../../entities/colaborador.entity.js";
import { ColaboradorRepository } from "../colaborador.repository.js";
import { ServiceResponse } from "../../../types/service.response.js";

export class DeleteColaborador {
    constructor(private repo: ColaboradorRepository){};

    async ejecutar(id_colaborador: string): Promise<ServiceResponse<null>> {
        const colaborador = await this.repo.findOne(id_colaborador);

        if (!colaborador) {
            return {
                status: 404,
                success: false,
                messages: ["Colaborador no encontrado"],
                data: null
            };
        };
        await this.repo.delete(id_colaborador);

        return {
            status: 200,
            success: true,
            messages: ["Colaborador eliminado exitosamente"],
            data: null
        };
    };
};