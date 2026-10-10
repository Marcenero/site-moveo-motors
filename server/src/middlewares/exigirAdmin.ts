import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

const emailsAdministradores = new Set(
    (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

const segredo = process.env.INTERNAL_AUTH_SECRET;

if (!segredo || Buffer.from(segredo, "base64").length !== 32) {
    throw new Error("INTERNAL_AUTH_SECRET inválido ou ausente.");
}

const chave = Buffer.from(segredo, "base64");

export async function exigirAdmin(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            ok: false,
            erro: "Autenticação necessária.",
        });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            ok: false,
            erro: "Credencial ausente.",
        });
    }

    try {
        const { payload } = await jwtVerify(token, chave, {
            issuer: "moveo-motors-nextjs",
            audience: "moveo-motors-express",
            algorithms: ["HS256"],
            clockTolerance: 5,
        });

        const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

        const id = payload.sub;

        if (!id || !email || !emailsAdministradores.has(email)) {
            return res.status(403).json({
                ok: false,
                erro: "Acesso não autorizado.",
            });
        }

        res.locals.usuario = {
            id,
            email,
        };

        return next();
    } catch {
        return res.status(401).json({
            ok: false,
            erro: "Credencial inválida ou expirada.",
        });
    }
}
