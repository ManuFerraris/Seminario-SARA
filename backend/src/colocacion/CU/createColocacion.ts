import { Colocacion } from "../../entities/colocacion.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { ColocacionRepository } from "../colocacion.repository.js";
import { validarCreacionColocacion } from "../validarCreacionColocacion.js";
import { FichaMedicaRepository } from "../../fichaMedica/fichaMedica.repository.js";
import { ColocacionDTO } from "../colocacionDTO.js";
import { VacunaRepository } from "../../vacuna/vacuna.repository.js";

export class CreateColocacion {
    constructor(
        private readonly colocacionRepository: ColocacionRepository,
        private readonly fichaRepository: FichaMedicaRepository,
        private readonly vacunaRepository: VacunaRepository
    ) {}

    async ejecutar(dto: ColocacionDTO): Promise<ServiceResponse<Colocacion>> {
        const errores = validarCreacionColocacion(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const ficha = await this.fichaRepository.getOneFichaMedica(dto.nro_ficha);
        if (!ficha) {
            return { status: 404, success: false, messages: ["Ficha médica no encontrada."], data: undefined };
        }

        const vacuna = await this.vacunaRepository.getOneVacuna(dto.nro_vacuna);
        if (!vacuna) {
            return { status: 404, success: false, messages: ["Vacuna no encontrada en el catálogo."], data: undefined };
        }

        const nuevaColocacion = new Colocacion();
        nuevaColocacion.ficha = ficha;
        nuevaColocacion.vacuna = vacuna;
        // Mapeamos el nombre del DTO a la propiedad de la entidad
        nuevaColocacion.fecha_hora = new Date(dto.fecha_colocacion);
        nuevaColocacion.cantidad = dto.cantidad;

        await this.colocacionRepository.createColocacion(nuevaColocacion);

        return { status: 201, success: true, messages: ["Colocación registrada exitosamente."], data: nuevaColocacion };
    }
}