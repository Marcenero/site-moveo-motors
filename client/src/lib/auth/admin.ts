import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./server";

const admins = new Set((process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));

export async function verificarAdmin() {
    await connection();
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { autorizado: false as const, motivo: "unauthenticated" as const };
    const email = user.email?.trim().toLowerCase();
    if (!email || !admins.has(email)) return { autorizado: false as const, motivo: "forbidden" as const };
    return { autorizado: true as const, usuario: { id: user.id, email } };
}

export async function exigirAdminNaPagina() {
    const resultado = await verificarAdmin();
    if (!resultado.autorizado) redirect(resultado.motivo === "forbidden" ? "/admin/login?error=forbidden" : "/admin/login");
    return resultado.usuario;
}
