import { Animal } from "../../entities/animal.entity.js";
import { AnimalRepository } from "../animal.repository.js";
import { ServiceResponse } from "../../types/service.response.js";

export class CambiarEstadoDisponible {
    constructor(private repo: AnimalRepository) {};

    async ejecutar(codAnimal: number): Promise<ServiceResponse<Partial<Animal>>> {
        
        const animal = await this.repo.obtenerFichasMedicas(codAnimal);
        if (!animal) {
            return {
                status: 404,
                success: false,
                messages: ["No se encontró el animal con el código proporcionado"],
                data: undefined
            };
        }

        // 2. Extraemos el arreglo real de TypeScript desde la Collection de Mikro-ORM
        const fichas = animal.fichas_medicas.getItems();

        if (fichas.length === 0) {
            return {
                status: 400,
                success: false,
                messages: ["El animal no tiene una ficha médica activa, no se puede cambiar su estado a 'Disponible'"],
                data: undefined
            };
        }

        // Verificamos si AL MENOS UNA ficha médica tiene colocaciones.
        // Si 'colocaciones' también es una relación OneToMany (Collection), usamos getItems()
        const tieneColocaciones = fichas.some(ficha => {
            const colocaciones = ficha.colocaciones.getItems(); 
            return colocaciones.length > 0;
        });

        if (!tieneColocaciones) {
            return {
                status: 400,
                success: false,
                messages: ["El animal no tiene colocaciones activas, no se puede cambiar su estado a 'Disponible'"],
                data: undefined
            };
        }

        // Si pasa todas las validaciones, cambiamos el estado
        await this.repo.cambiarEstadoDisponible(animal);

        const datosNecesarios = {
            nro_animal: animal.nro_animal,
            estado: animal.estado
        };

        return {
            status: 200,
            success: true,
            messages: ["Estado del animal actualizado correctamente"],
            data: datosNecesarios
        };
    }
}