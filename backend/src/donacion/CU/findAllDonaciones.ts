import { Donacion } from "../../entities/donacion.entity.js";
import { ServiceResponse } from "../../types/service.response.js";
import { DonacionRepository } from "../donacion.reposiroty.js";

export class FindAllDonaciones {
    constructor(private repo: DonacionRepository) {}
    async ejecutar(): Promise<ServiceResponse<Donacion[]>> {
        const donaciones = await this.repo.traerTodasDonaciones();
        return {
            status: 200,
            success: true,
            messages: ["Donaciones encontradas"],
            data: donaciones
        };
    };
};