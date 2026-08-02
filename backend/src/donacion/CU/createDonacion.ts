import { Donacion } from "../../entities/donacion.entity.js";
import { DonacionDTO } from "../donacionDTO.js";
import { DonacionRepository } from "../donacion.reposiroty.js";
import { VacunaRepository } from "../../vacuna/vacuna.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";
import { ServiceResponse } from "../../types/service.response.js";
import { validarCreacionDonacion } from "../validarCreacionDonacion.js";
import { Vacuna } from "../../entities/vacuna.entity.js";

export class CreateDonacion {
    // Inyectamos también el repo de Persona para buscar al donante
    constructor(
        private repo: DonacionRepository,
        private vacunaRepo: VacunaRepository,
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

        // Actualizamos el stock de la vacuna si la donación es de tipo 'Vacuna'
        if(donacionCreada.tipo === 'Vacuna') {
            const nuevaVacuna = new Vacuna();
            nuevaVacuna.droga = donacionCreada.descripcion!;
            nuevaVacuna.stock = donacionCreada.cantidad;
            nuevaVacuna.fecha_ingreso = new Date();
            nuevaVacuna.fecha_vencimiento = new Date(donacionCreada.fecha_vencimiento!);
            await this.vacunaRepo.createVacuna(nuevaVacuna);
        };
        
        return {
            status: 201,
            success: true,
            messages: ["Donación creada exitosamente"],
            data: donacionCreada
        };
    }
}