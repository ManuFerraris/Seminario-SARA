import { AdopcionRepository } from "../../adopcion/adopcion.repository";
import { Seguimiento } from "../../entities/seguimiento.entity";
import { ServiceResponse } from "../../types/service.response";
import { SeguimientoRepository } from "../seg.repository";
import { SeguimientoDTO } from "../seguimientoDTO";
import { validarCreacionSeguimiento } from "../validarCreacionSeguimiento";

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

        const fechaSeguimiento = new Date(dto.fecha_seguimiento);
        if (fechaSeguimiento.getTime() < adopcion.fecha_adopcion.getTime()) {
            return { status: 400, success: false, messages: ["La fecha del seguimiento no puede ser anterior a la fecha de adopción."], data: undefined };
        }

        const nuevoSeguimiento = new Seguimiento();
        nuevoSeguimiento.adopcion = adopcion;
        nuevoSeguimiento.fecha_seguimiento = fechaSeguimiento;
        nuevoSeguimiento.estado_animal = dto.estado_animal.trim();
        nuevoSeguimiento.entorno = dto.entorno.trim();

        await this.seguimientoRepository.createSeguimiento(nuevoSeguimiento);

        return { status: 201, success: true, messages: ["Seguimiento registrado exitosamente."], data: nuevoSeguimiento };
    }
}