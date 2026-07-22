import { Request, Response } from 'express';
import { LoginPersona } from './loginPersona.js';

export class AuthController {
    constructor(private readonly loginPersona: LoginPersona) {}

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // 1. Validación rápida de entrada
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    messages: ["Faltan credenciales (email y password)."]
                });
            }

            // 2. Ejecutamos el caso de uso
            const result = await this.loginPersona.ejecutar(email, password);

            // 3. Devolvemos la respuesta (el status code viene del use case)
            return res.status(result.status).json({
                success: result.success,
                messages: result.messages,
                data: result.data
            });

        } catch (error: any) {
            console.error("Error en login:", error);
            return res.status(500).json({
                success: false,
                messages: ["Error interno del servidor al procesar el login."]
            });
        }
    }
}