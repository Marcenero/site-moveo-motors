"use client";

import { useState } from "react";
import { createClient } from "../../../../../supabase/client";

const MENSAGEM_GENERICA = "Se este email estiver autorizado, você receberá um link de acesso.";

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

        const emailNormalizado = email.trim().toLowerCase();

        try {
            const supabase = createClient();

            const siteUrl = 
                process.env.NEXT_PUBLIC_SITE_URL ||
                window.location.origin;

            const { error } = 
                await supabase.auth.signInWithOtp({
                    email: emailNormalizado,

                    options: {
                        emailRedirectTo:
                            `${siteUrl}/auth/confirm?next=/admin`,

                        shouldCreateUser: false,
                    },
                });
            
            if (!error) {
                setMensagem(MENSAGEM_GENERICA);
                return;
            }

            console.error("Erro ao solicitar Magic Link:"),
            {
                code: error.code,
                name: error.name,
                message: error.message,
            }

            switch (error.code) {
                case "user_not_found":
                case "signup_disabled":
                    setMensagem(MENSAGEM_GENERICA);
                    return;

                case "over_email_send_rate_limit":
                case "over_request_rate_limit":
                    setErro("Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente.");
                    return;

                case "email_address_invalid":
                case "validation_failed":
                    setErro("Digite um email válido.");
                    return;

                default:
                    setErro("Não foi possível solicitar o link de acesso. Tente novamente mais tarde.");
                    return;
            }
        }
        catch (error) {
            console.error("Erro inesperado no login:", error);

            setErro("Não foi possível solicitar o link de acesso. Tente novamente em alguns instantes.");
        }
        finally {
            setCarregando(false);
        }
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

                <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Email
                </label>

                <input 
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                    disabled={carregando}
                    placeholder="admin@email.com"
                    className="mb-4 w-full rounded-xl border brder-gray-300 px-4 py-4 outline-none focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
                />

                {erro && (
                    <p
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                    >
                        {erro}
                    </p>
                )}

                {mensagem && (
                    <p
                        aria-live="polite"
                        className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
                    >
                        {mensagem}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={carregando}
                    className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {carregando
                        ? "Enviando..."
                        : "Envair link de acesso"}
                </button>
            </form>
        </main>
    );
}