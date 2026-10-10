import "server-only";

import { auth } from "./server";

const emailsAdministradores = new Set(
    (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

export async function verificarAdmin() {
    const { data, error } = await auth.getSession();

    if (error || !data?.user || !data?.session) {
        return {
            autorizado: false as const,
            motivo: "unauthenticated" as const,
        };
    }

    const email = data.user.email?.trim().toLowerCase();

    if (!email || !emailsAdministradores.has(email)) {
        return {
            autorizado: false as const,
            motivo: "forbidden" as const,
        };
    }

    return {
        autorizado: true as const,
        usuario: data.user,
        sessao: data.session,
    };
}
