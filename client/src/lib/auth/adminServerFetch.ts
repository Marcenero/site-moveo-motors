import "server-only";

import { SignJWT } from "jose";

import { verificarAdmin } from "./admin";

type ResultadoAdmin =
    | { autorizado: false; motivo: "unauthenticated" | "forbidden" }
    | { autorizado: true; response: Response };

export async function adminServerFetch(
    caminho: string,
    options: RequestInit = {}
): Promise<ResultadoAdmin> {
    const resultado = await verificarAdmin();

    if (!resultado.autorizado) {
        return {
            autorizado: false,
            motivo: resultado.motivo,
        };
    }

    const backendUrl = process.env.BACKEND_INTERNAL_URL;
    const segredo = process.env.INTERNAL_AUTH_SECRET;

    if (!backendUrl || !segredo) {
        throw new Error("Configuração de autenticação interna ausente.");
    }

    const chave = Buffer.from(segredo, "base64");

    if (chave.length !== 32) {
        throw new Error("INTERNAL_AUTH_SECRET inválido.");
    }

    if (!caminho.startsWith("/") || caminho.startsWith("//")) {
        throw new Error("Caminho inválido.");
    }

    const destino = new URL(caminho, `${backendUrl.replace(/\/$/, "")}/`);

    if (
        !["/audit", "/veiculos"].some(
            (prefixo) => destino.pathname === prefixo || destino.pathname.startsWith(`${prefixo}/`)
        )
    ) {
        throw new Error("Rota não autorizada.");
    }

    const token = await new SignJWT({
        email: resultado.usuario.email,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(resultado.usuario.id)
        .setIssuer("moveo-motors-nextjs")
        .setAudience("moveo-motors-express")
        .setIssuedAt()
        .setExpirationTime("60s")
        .sign(chave);

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(destino, {
        ...options,
        headers,
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(30000),
    });

    return { autorizado: true, response };
}
