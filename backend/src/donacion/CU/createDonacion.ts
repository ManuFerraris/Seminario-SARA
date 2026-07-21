import { Donacion } from "../../entities/donacion.entity.js";
import { DonacionDTO } from "../donacionDTO.js";
import { DonacionRepository } from "../donacion.reposiroty.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionDonacion } from "../validarCreacionDonacion.js";

export class CreateDonacion {
    // Inyectamos también el repo de Persona para buscar al donante
    constructor(
        private repo: DonacionRepository,
        private personaRepo: PersonaRepository 
    ) {}

    async ejecutar(dto: DonacionDTO): Promise<ServiceResponse<Donacion>> {
        const errores = validarCreacionDonacion(dto);
        if (errores.length > 0) {
            return {
                status: 400,
                success: false,
                messages: errores,
                data: undefined
            };
        }

        // 1. Buscar a la persona (donante)
        const personaDonante = await this.personaRepo.findOne(dto.dni_donante);
        if (!personaDonante) {
            return {
                status: 404,
                success: false,
                messages: ["El donante indicado no existe en el sistema"],
                data: undefined
            };
        }

        // 2. Crear la donación y armar las relaciones
        const nuevaDonacion = new Donacion();
        nuevaDonacion.tipo = dto.tipo;
        nuevaDonacion.cantidad = dto.cantidad; 
        
        // Relación con Persona
        nuevaDonacion.persona = personaDonante;
        
        if (dto.descripcion) {
            nuevaDonacion.descripcion = dto.descripcion;
        }
        
        // Manejo seguro de la fecha opcional
        if (dto.fecha_vencimiento) {
            nuevaDonacion.fecha_vencimiento = new Date(dto.fecha_vencimiento);
        }

        // 3. Guardar en base de datos
        const donacionCreada = await this.repo.crearDonacion(nuevaDonacion);
        
        return {
            status: 201,
            success: true,
            messages: ["Donación creada exitosamente"],
            data: donacionCreada
        };
    }
}