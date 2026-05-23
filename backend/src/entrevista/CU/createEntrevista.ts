import { Entrevista } from "../../entities/entrevista.entity.js";
import { EntrevistaRepository } from "../../entrevista/entrevista.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AdoptanteRepository } from "../../persona/adoptante/adoptante.repositoty.js";
import { ColaboradorRepository } from "../../persona/colaborador/colaborador.repository.js";
import { EntrevistaDTO } from "../entrevistaDTO.js";
import { validarCreacionEntrevista } from "../validarCreacionEntrevista.js";
import { validarCodigo } from "../../helpers/validarCodigo.js";

export class CreateEntrevista {
    constructor( 
        private entRepo: EntrevistaRepository,
        private colabRepo: ColaboradorRepository,
        private adoptRepo: AdoptanteRepository
    ) {}

    async ejecutar(dto: EntrevistaDTO): Promise<ServiceResponse<Entrevista>> {
        
        // 1. Validación sintáctica de los datos de entrada
        const errores = validarCreacionEntrevista(dto);
        if(errores.length > 0){
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        // 2. Validación de Reglas de Negocio (Integridad Referencial)
        // Buscamos a los actores involucrados en la entrevista
        
        const colaborador = await this.colabRepo.findOne(String(dto.id_colaborador));
        if (!colaborador) {
            return {
                success: false,
                status: 404,
                messages: [`No se encontró un colaborador con el ID ${dto.id_colaborador}`],
                data: undefined
            };
        }

        const adoptante = await this.adoptRepo.findOne(dto.numero_adoptante);
        if (!adoptante) {
            return {
                success: false,
                status: 404,
                messages: [`No se encontró un adoptante con el ID ${dto.numero_adoptante}`],
                data: undefined
            };
        }

        // 3. Prevención de Duplicados (Opcional pero muy recomendado por la PK Compuesta)
        const fechaEntrevista = new Date(dto.fecha_hora);
        const entrevistaExistente = await this.entRepo.buscarEntrevista(adoptante, colaborador, fechaEntrevista);
        if (entrevistaExistente) {
            return {
                success: false,
                status: 409, // 409 Conflict
                messages: ["Ya existe una entrevista programada para este adoptante y colaborador en esa fecha y hora exacta."],
                data: undefined
            };
        }

        // 4. Instanciación y mapeo
        const nuevaEntrevista = new Entrevista();
        
        // ¡Magia del ORM! Le asignamos los objetos completos, no solo los IDs
        nuevaEntrevista.adoptante = adoptante;
        nuevaEntrevista.colaborador = colaborador;
        
        nuevaEntrevista.fecha_hora = fechaEntrevista;
        nuevaEntrevista.fecha_hora_rep = new Date(dto.fecha_hora_rep);
        nuevaEntrevista.estado = dto.estado;
        
        if(dto.descripcion) nuevaEntrevista.descripcion = dto.descripcion;
        if(dto.aprobada !== undefined) nuevaEntrevista.aprobada = dto.aprobada;

        // 5. Persistencia
        // (Asegúrate de que el método en tu entRepo se llame 'create' o cámbialo a como lo hayas definido)
        const entrevistaCreada = await this.entRepo.crearEntrevista(nuevaEntrevista);

        return {
            success: true,
            status: 201,
            messages: ["Entrevista creada exitosamente"],
            data: entrevistaCreada
        };
    }
}