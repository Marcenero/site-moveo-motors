import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { supabase } from "../services/supabase.js";

const emailsAdministradores = new Set(
    (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

export async function exigirAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authorization = req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                ok: false,
                erro: "Autenticação necessária.",
            });
        }

        const token = 
            authorization
                .slice("Bearer ".length)
                .trim();

        if (!token) {
            return res.status(401).json({
                ok: false,
                erro: "Token de autenticação ausente.",
            });
        }

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                ok: false,
                erro: "Sessão inválida ou expirada.",
            });
        }

        const email = user.email?.trim().toLowerCase();

        if (
            !email ||
            !emailsAdministradores.has(email)
        ) {
            return res.status(403).json({
                ok: false,
                erro: "Você não possui permissão para esta operação.",
            });
        }

        res.locals.usuario = {
            id: user.id,
            email,
        };

        return next();
    }
    catch (error) {
        console.error(
            "Erro ao validar administrador:",
            error
        );

        return res.status(500).json({
            ok: false,
            erro: "Erro interno de autenticação.",
        });
    }
}