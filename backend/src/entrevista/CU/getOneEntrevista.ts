import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AdoptanteRepository } from "../../persona/adoptante/adoptante.repositoty.js";
import { ColaboradorRepository } from "../../persona/colaborador/colaborador.repository.js";

export class GetOneEntrevista {
    constructor( private entRepo: EntrevistaRepository,
        private colabRepo: ColaboradorRepository,
        private adoptRepo: AdoptanteRepository
    ) {}

    async ejecutar (id_colaborador: string, id_adoptante: number, fecha: Date): Promise<ServiceResponse<Entrevista>> {
        const colaborador = await this.colabRepo.findOne(id_colaborador);
        if (!colaborador) {
            return {
                success: false,
                status:404,
                messages: ["Colaborador no encontrado"],
                data: undefined
            };
        };

        const adoptante = await this.adoptRepo.findOne(id_adoptante);
        if (!adoptante) {
            return {
                success: false,
                status:404,
                messages: ["Adoptante no encontrado"],
                data: undefined
            };
        };

        const entrevista = await this.entRepo.buscarEntrevista(adoptante, colaborador, fecha);
        if (!entrevista) {
            return {
                success: false,
                status:404,
                messages: ["Entrevista no encontrada"],
                data: undefined
            };
        };
        
        return {
            success: true,
            status:200,
            messages: ["Entrevista encontrada"],
            data: entrevista
        };
    }
}