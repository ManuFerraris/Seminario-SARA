import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AdoptanteRepository } from "../../persona/adoptante/adoptante.repositoty.js";
import { ColaboradorRepository } from "../../persona/colaborador/colaborador.repository.js";

export class BajaLogicaEntrevista {
    constructor( 
        private entRepo: EntrevistaRepository,
        private colabRepo: ColaboradorRepository,
        private adoptRepo: AdoptanteRepository
    ) {}

    async ejecutar(
        numero_adoptante: number, 
        id_colaborador: string, 
        fecha_hora: Date
    ): Promise<ServiceResponse<Entrevista>> {
        
        const colaborador = await this.colabRepo.findOne(String(id_colaborador));
        if (!colaborador) {
            return {
                success: false,
                status: 404,
                messages: ["Colaborador no encontrado"],
                data: undefined
            };
        }

        const adoptante = await this.adoptRepo.findOne(numero_adoptante);
        if (!adoptante) {
            return {
                success: false,
                status: 404,
                messages: ["Adoptante no encontrado"],
                data: undefined
            };
        }

        // Buscar la entrevista original
        const entrevista = await this.entRepo.buscarEntrevista(adoptante, colaborador, fecha_hora);
        if (!entrevista) {
            return {
                success: false,
                status: 404,
                messages: ["No se encontró la entrevista solicitada para dar de baja."],
                data: undefined
            };
        }

        entrevista.estado = "Cancelada"; 

        // 4. Persistencia
        // Reutilizamos el mismo método del repositorio que ya hace el em.flush()
        const entrevistaCancelada = await this.entRepo.actualizarEntrevista(entrevista);

        return {
            success: true,
            status: 200,
            messages: ["Entrevista dada de baja (cancelada) exitosamente."],
            data: entrevistaCancelada
        };
    }
}