"use client";

import { useState } from "react";
import { createClient } from "../../../supabase/client";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        setErro("");
        setMensagem("");
        setCarregando(true);

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOtp({
            email: email.trim().toLowerCase(),
            options: {
                emailRedirectTo: `${window.location.origin}/auth/confirm?next=/admin`,
                shouldCreateUser: false,
            },
        });

        setCarregando(false);

        if (error) {
            console.error("Erro Supabase:", error);

            const mensagemErro = error.message.toLowerCase();

            if (mensagemErro.includes("rate limit")) {
                setErro("Você tentou enviar muitos links em pouco tempo. Aguarde alguns minutos e tente novamente.");
                return;
            }

            if (
                mensagemErro.includes("signup") ||
                mensagemErro.includes("signups not allowed") ||
                mensagemErro.includes("user not found") ||
                mensagemErro.includes("not found")
            ) {
                setErro("Este email não está autorizado para acessar o painel.");
                return;
            }

            if (
                mensagemErro.includes("redirect") ||
                mensagemErro.includes("not allowed")
            ) {
                setErro("A URL de redirecionamento não está autorizada no Supabase. Verifique as Redirect URLs.");
                return;
            }

            if (
                mensagemErro.includes("invalid email") ||
                mensagemErro.includes("email address")
            ) {
                setErro("Digite um email válido.");
                return;
            }

            setErro("Não foi possível enviar o link de acesso. Tente novamente em alguns instantes.");
            return;
        }

        setMensagem("Enviamos um link de acesso para o seu email.");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                    Admin Moveo Motors
                </h1>

                <p className="mb-6 text-sm text-gray-500">
                    Digite o seu email para receber o link de acesso.
                </p>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                </label>

                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@email.com"
                    className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-yellow-500"
                />

                {erro && (
                    <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                        {erro}
                    </p>
                )}

                {mensagem && (
                    <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                        {mensagem}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={carregando}
                    className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {carregando ? "Enviando..." : "Enviar link de acesso"}
                </button>
            </form>
        </main>
    );
}