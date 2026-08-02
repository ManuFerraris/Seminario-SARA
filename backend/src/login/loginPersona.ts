import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PersonaRepository } from '../persona/persona.repository.js';
import { AdoptanteRepository } from '../persona/ado.repository.js';
import { ColaboradorRepository } from '../persona/col.repository.js';
import { VeterinarioRepository } from '../persona/vet.repository.js';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET as string;

export class LoginPersona {
    constructor(private readonly personaRepository: PersonaRepository,
        private readonly colaboradorRepository: ColaboradorRepository,
        private readonly adoptanteRepository: AdoptanteRepository,
        private readonly veterinarioRepository: VeterinarioRepository
    ) {}
    async ejecutar(email: string, passwordPlano: string) {

        const persona = await this.personaRepository.findByEmail( email );

        if (!persona) {
            return {
                status: 401,
                success: false, 
                messages: ["Credenciales inválidas."]
            };
        }
        const colaborador = await this.colaboradorRepository.findOneByPersona(persona);
        const adoptante = await this.adoptanteRepository.findOneByPersona(persona);
        const veterinario = await this.veterinarioRepository.findOneByPersona(persona);

        // 2. Comparamos la contraseña enviada con el hash guardado
        const passwordValida = await bcrypt.compare(passwordPlano, persona.contrasenia);
        
        if (!passwordValida) {
            return { 
                status: 401, 
                success: false, 
                messages: ["Credenciales inválidas."] 
            };
        }

        // Inferimos los roles evaluando los atributos directos de la entidad
        const roles: string[] = [];
        
        if (colaborador) {
            roles.push('Colaborador');
        }
        if (adoptante) {
            roles.push('Adoptante');
        }
        if (veterinario) {
            roles.push('Veterinario');
        }
        
        // Si no tiene ninguno de los tres, es un usuario básico registrado
        if (roles.length === 0) {
            roles.push('Usuario'); 
        }
        
        // Si no tiene ninguno de los tres, es un usuario básico registrado
        if (roles.length === 0) {
            roles.push('Usuario'); 
        }
        
        const payload = {
            dni: persona.dni,
            nombre: persona.nombre,
            roles: roles // Los roles inferidos viajan dentro del token
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });

        return { 
            status: 200, 
            success: true, 
            messages: ["Login exitoso."], 
            data: { token, roles } 
        };
    }
}