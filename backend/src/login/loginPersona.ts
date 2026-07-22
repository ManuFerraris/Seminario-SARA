import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PersonaRepository } from '../persona/persona.repository.js';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET as string;

export class LoginPersona {
    constructor(private readonly personaRepository: PersonaRepository) {}
    async ejecutar(email: string, passwordPlano: string) {

        const persona = await this.personaRepository.findByEmail( email );

        if (!persona) {
            return {
                status: 401,
                success: false, 
                messages: ["Credenciales inválidas."]
            };
        }

        // 2. Comparamos la contraseña enviada con el hash guardado
        const passwordValida = await bcrypt.compare(passwordPlano, persona.contrasenia);
        
        if (!passwordValida) {
            return { 
                status: 401, 
                success: false, 
                messages: ["Credenciales inválidas."] 
            };
        }

        // 3. Inferimos los roles evaluando los atributos directos de la entidad
        const roles: string[] = [];
        
        // Si el campo tiene un código (no es null, undefined, ni string vacío), se asigna el rol
        if (persona.id_colaborador) {
            roles.push('Colaborador');
        }
        if (persona.id_adoptante) {
            roles.push('Adoptante');
        }
        if (persona.matricula) {
            roles.push('Veterinario');
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