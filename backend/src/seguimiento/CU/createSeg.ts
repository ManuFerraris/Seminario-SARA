import { AdopcionRepository } from "../../adopcion/adopcion.repository.js";
import { Seguimiento } from "../../entities/seguimiento.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { SeguimientoRepository } from "../seg.repository.js";
import { SeguimientoDTO } from "../seguimientoDTO.js";
import { validarCreacionSeguimiento } from "../validarCreacionSeguimiento.js";

export class CreateSeguimiento {
    constructor(
        private readonly seguimientoRepository: SeguimientoRepository,
        private readonly adopcionRepository: AdopcionRepository
    ) {}

    async ejecutar(dto: SeguimientoDTO): Promise<ServiceResponse<Seguimiento>> {
        const errores = validarCreacionSeguimiento(dto);
        if (errores.length > 0) {
            return { status: 400, success: false, messages: errores, data: undefined };
        }

        const adopcion = await this.adopcionRepository.getOneAdopcion(dto.nro_adopcion);
        if (!adopcion) {
            return { status: 404, success: false, messages: ["La adopción indicada no existe."], data: undefined };
        }

        // 1. Envolvemos ambas fechas en new Date() estrictamente para poder compararlas
        const fechaSeguimientoCheck = new Date(dto.fecha_seguimiento);
        const fechaAdopcionCheck = new Date(adopcion.fecha_adopcion);

        if (fechaSeguimientoCheck.getTime() < fechaAdopcionCheck.getTime()) {
            return { status: 400, success: false, messages: ["La fecha del seguimiento no puede ser anterior a la fecha de adopción."], data: undefined };
        }

        const nuevoSeguimiento = new Seguimiento();
        nuevoSeguimiento.adopcion = adopcion;
        
        // 2. Le pasamos el valor crudo (string) para que MikroORM lo guarde sin quejarse
        nuevoSeguimiento.fecha_seguimiento = dto.fecha_seguimiento as any; 
        nuevoSeguimiento.estado_animal = dto.estado_animal.trim();
        nuevoSeguimiento.entorno = dto.entorno.trim();

        await this.seguimientoRepository.createSeguimiento(nuevoSeguimiento);

        return { status: 201, success: true, messages: ["Seguimiento registrado exitosamente."], data: nuevoSeguimiento };
    }
}