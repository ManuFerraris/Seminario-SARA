import { Audiovisual } from "../../entities/audiovisual.entity.js";
import { AudiovisualDTO } from "../audiovisualDTO.js";
import { AnimalRepository } from "../../animal/animal.repository.js";
import { CloudinaryService } from "../../shared/cloudinary.service.js";
import { ServiceResponse } from "../../types/service.response.js";
import { AudiovisualRepository } from "../aud.repository.js";

export class CreateAudiovisual {
    constructor(
        private audiovisualRepository: AudiovisualRepository,
        private animalRepository: AnimalRepository,
        private cloudinaryService: CloudinaryService
    ) {}

    async ejecutar(dto: AudiovisualDTO, fileBuffer: Buffer): Promise<ServiceResponse<Audiovisual>> {
        
        // 1. Validaciones de DTO (¡ANTES de tocar Cloudinary!)
        if (!dto.nro_animal) {
            return {
                success: false,
                status: 400,
                messages: ["El nro_animal es obligatorio"],
                data: undefined
            };
        }
        if (dto.descripcion && dto.descripcion.length > 255) {
            return {
                success: false,
                status: 400,
                messages: ["La descripción no puede tener más de 255 caracteres"],
                data: undefined
            };
        }

        // 2. Validamos que el animal exista
        const animal = await this.animalRepository.getOne(dto.nro_animal);
        if (!animal) {
            return {
                success: false,
                status: 404,
                messages: ["Animal no encontrado"],
                data: undefined
            };
        }

        // 3. Subimos el archivo a Cloudinary (ahora es seguro)
        let urlCloudinary: string;
        try {
            urlCloudinary = await this.cloudinaryService.uploadBuffer(fileBuffer, 'SARA_Audiovisuales');
        } catch (error) {
            return {
                success: false,
                status: 500,
                messages: ["Error al subir el archivo a Cloudinary"],
                data: undefined
            };
        }

        // 4. Creamos el registro
        const nuevoAudiovisual = new Audiovisual();
        nuevoAudiovisual.animal = animal;
        nuevoAudiovisual.url_material = urlCloudinary; 
        nuevoAudiovisual.descripcion = dto.descripcion;

        await this.audiovisualRepository.create(nuevoAudiovisual);

        return {
            success: true,
            status: 201,
            messages: ["Archivo audiovisual subido y registrado exitosamente"],
            data: nuevoAudiovisual
        };
    }
}