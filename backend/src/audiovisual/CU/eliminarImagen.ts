import { AudiovisualRepository } from "../aud.repository.js";
import { CloudinaryService } from "../../shared/cloudinary.service.js";

export class DeleteAudiovisual {
    constructor(
        private audiovisualRepository: AudiovisualRepository,
        private cloudinaryService: CloudinaryService
    ) {}

    async ejecutar(numero_audiovisual: number): Promise<any> {
        
        // 1. Buscamos si el registro existe en Aiven
        const audiovisual = await this.audiovisualRepository.getOne(numero_audiovisual);
        if (!audiovisual) {
            return {
                success: false,
                status: 404,
                messages: ["El archivo audiovisual no existe"],
                data: undefined
            };
        }

        // 2. Intentamos borrarlo de la nube de Cloudinary
        const borradoNube = await this.cloudinaryService.deleteImageByUrl(audiovisual.url_material);
        
        if (!borradoNube) {
            // Si Cloudinary falla, detenemos todo. No queremos inconsistencias.
            return {
                success: false,
                status: 500,
                messages: ["Error al eliminar el archivo físico en la nube"],
                data: undefined
            };
        }

        // 3. Si la nube lo borró con éxito, lo borramos de la base de datos
        await this.audiovisualRepository.delete(audiovisual);

        return {
            success: true,
            status: 200,
            messages: ["Archivo audiovisual eliminado correctamente de la nube y la base de datos"],
            data: undefined
        };
    }
}