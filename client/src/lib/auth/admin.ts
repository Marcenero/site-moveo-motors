import "server-only";

import { auth } from "./server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const emailsAdministradores = new Set(
    (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

export async function verificarAdmin() {
    await connection();
    
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

export async function exigirAdminNaPagina() {
    const resultado = await verificarAdmin();

    if (!resultado.autorizado) {
        if (resultado.motivo === "forbidden") {
            redirect("/admin/login?error=forbidden");
        }

        redirect("/admin/login");
    }

    return resultado.usuario;
}