import * as Sentry from "@sentry/node";

import { logError } from "../services/logger.js";

import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { supabase } from "../services/supabase.js";
import { capturarErro } from "../services/monitoring.js";

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
            error: erroAutenticacao,
        } = await supabase.auth.getUser(token);

        if (erroAutenticacao || !user) {
            Sentry.metrics.count(
                "auth_failure",
                1,
                {
                    attributes: {
                        reason: "invalid_session",
                    },
                }
            );

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
        capturarErro(
            error,
            "auth",
            "exigir_admin"
        );

        logError(
            "admin_auth_validation_failed",
            error,
            {
                component: "auth",
                operation: "exigir_admin",
                status: 500,
            }
        );

        return res.status(500).json({
            ok: false,
            erro: "Erro interno de autenticação.",
        });
    }
}