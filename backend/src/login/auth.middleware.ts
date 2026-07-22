import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET as string;

// 1. Extendemos la Request de Express para que no chille TypeScript al usar req.user
export interface AuthRequest extends Request {
    user?: {
        dni: string;
        nombre: string;
        roles: string[];
    };
}

// 2. Creamos el Middleware (Usa una función "fábrica" para aceptar argumentos)
export const verificarToken = (rolesPermitidos: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
        // El token viaja en los headers como: "Authorization: Bearer eyJhb..."
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                messages: ["Acceso denegado. Token no proporcionado."] 
            });
        }

        try {
            // Verificamos y decodificamos el payload
            const payload = jwt.verify(token, SECRET_KEY) as NonNullable<AuthRequest['user']>;

            // Inyectamos el payload en la petición por si el controlador lo necesita luego
            req.user = payload;

            // 3. Lógica de Autorización (RBAC)
            // Si pasamos roles por parámetro, verificamos que el usuario tenga al menos uno
            if (rolesPermitidos.length > 0) {
                const tieneRol = rolesPermitidos.some(rol => payload.roles.includes(rol));
                
                if (!tieneRol) {
                    return res.status(403).json({ 
                        success: false, 
                        messages: ["Permisos insuficientes para esta acción."] 
                    });
                }
            }

            // 4. Si todo está en orden, le damos paso al controlador
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                messages: ["Token inválido o expirado."] 
            });
        }
    };
};