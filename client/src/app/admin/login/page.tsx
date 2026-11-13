"use client";
import { useState, type FormEvent } from "react";
import { createClient } from "../../../lib/auth/client";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); setBusy(true); setError(""); setMessage("");
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim().toLowerCase(),
                options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
            });
            if (error) setError("Não foi possível enviar o link. Confira o e-mail e tente novamente.");
            else setMessage("Se este e-mail corresponder a um usuário existente, você receberá um link de acesso.");
        } catch { setError("Erro de comunicação. Tente novamente."); }
        finally { setBusy(false); }
    }
    return <main className="flex min-h-screen items-center justify-center px-4"><section className="w-full max-w-md space-y-6 rounded-2xl border p-8"><div><h1 className="text-2xl font-semibold">Administração Moveo Motors</h1><p className="mt-2 text-sm text-gray-500">Informe seu e-mail para receber um link de acesso.</p></div><form onSubmit={submit} className="space-y-4"><label className="block space-y-2"><span className="text-sm">Email</span><input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} className="w-full rounded-lg border p-3" placeholder="admin@exemplo.com" /></label><button type="submit" disabled={busy} className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50">{busy ? "Enviando..." : "Enviar Magic Link"}</button></form>{message && <p role="status" className="text-sm text-green-700">{message}</p>}{error && <p role="alert" className="text-sm text-red-600">{error}</p>}</section></main>;
}
