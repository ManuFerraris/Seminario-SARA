import { Rescate } from "../../entities/rescate.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { RescateRepository } from "../rescate.repository.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { PersonaRepository } from "../../persona/persona.repository.js";

export class GetOneRescates {
    constructor(private rescateRepository: RescateRepository,
        private animalRepository: AnimalRepository,
        private personaRepository: PersonaRepository
    ) {}
    async ejecutar(numero_p: number, numero_a:number, fecha_hora:Date): Promise<ServiceResponse<Rescate>> {

        const persona = await this.personaRepository.findOne(numero_p);
        if (!persona) {
            return {
                success: false,
                status:404,
                messages: ["Persona no encontrada"],
                data: undefined,
            };
        };

        const animal = await this.animalRepository.getOne(numero_a);
        if (!animal) {
            return {
                success: false,
                status:404,
                messages: ["Animal no encontrado"],
                data: undefined,
            };
        };

        const rescate = await this.rescateRepository.getOneRescate(numero_p, numero_a, fecha_hora);
        if (!rescate) {
            return {
                success: false,
                status:404,
                messages: ["Rescate no encontrado"],
                data: undefined,
            };
        };
        return {
            success: true,
            status:200,
            messages: ["Rescate encontrado"],
            data: rescate
        };
    };
}