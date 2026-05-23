import { Entrevista } from "../../entities/entrevista.entity.js";
import { AdoptanteRepository } from "../../persona/adoptante/adoptante.repositoty.js";
import { ColaboradorRepository } from "../../persona/colaborador/colaborador.repository.js";
import { EntrevistaRepository } from "../entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class DeleteEntrevista {
    constructor( private entRepo: EntrevistaRepository,
        private colabRepo: ColaboradorRepository,
        private adoptRepo: AdoptanteRepository
    ) {}

    async ejecutar (id_colaborador: string, id_adoptante: number, fecha: Date): Promise<ServiceResponse<null>> {
        
        const colaborador = await this.colabRepo.findOne(id_colaborador);
        if (!colaborador) {
            return {
                success: false,
                status: 404,
                messages: ["Colaborador no encontrado"],
                data: null
            };
        }
        const adoptante = await this.adoptRepo.findOne(id_adoptante);
        if (!adoptante) {
            return {
                success: false,
                status: 404,
                messages: ["Adoptante no encontrado"],
                data: null
            };
        }
        const entrevista = await this.entRepo.buscarEntrevista(adoptante, colaborador, fecha);
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["Entrevista no encontrada"],
                data: null
            };
        }
        await this.entRepo.eliminarEntrevista(adoptante, colaborador, fecha);
        return {
            success: true,
            status: 200,
            messages: ["Entrevista eliminada"],
            data: null
        };
    };
};