import type { off } from "node:cluster";

const CHAVES_SENSIVEIS =
    /authorization|cookie|set-cookie|access[_-]?token|refresh[_-]?token|password|secret|service[_-]?role|database[_-]?url|direct[_-]?url|jwt|email/i;

const SEGREDOS_AMBIENTE = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.DATABASE_URL,
    process.env.DIRECT_URL,
    process.env.JWT_SECRET,
    process.env.SENTRY_AUTH_TOKEN,
]
    .filter(
        (valor): valor is string =>
            typeof valor === "string" &&
            valor.length > 0
    );

function sanitizarString(
    valor: string
) {
    let resultado = valor;

    for (const segredo of SEGREDOS_AMBIENTE) {
        resultado = resultado
            .split(segredo)
            .join("[REDACTED]");
    }

    resultado = 
        resultado.replace(
            /Bearer\s+[^\s,;]+/gi,
            "Bearer [REDACTED]"
        );

    resultado =
        resultado.replace(
            /(access_token|refresh_token|token|password|secret)=([^&\s]+)/gi,
            "$1=[REDACTED]"
        );

    return resultado;
}

export function sanitizarDados(
    valor: unknown
): unknown {
    if (typeof valor === "string") {
        return sanitizarString(valor);
    }

    if (Array.isArray(valor)) {
        return valor.map(sanitizarDados);
    }

    if (valor !== null && typeof valor === "object") {
        const objeto = valor as Record<string, unknown>;

        const resultado: Record<string, unknown> = {};

        for (const [chave, conteudo] of Object.entries(objeto)) {
            if (CHAVES_SENSIVEIS.test(chave)) {
                resultado[chave] = "[REDACTED]";

                continue;
            }

            resultado[chave] = sanitizarDados(conteudo);
        }

        return resultado;
    }

    return valor;
}