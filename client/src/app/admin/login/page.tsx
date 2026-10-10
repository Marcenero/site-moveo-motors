"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "../../../lib/auth/client";

type Etapa = "email" | "codigo";

const MENSAGEM_GENERICA = "Se este email estiver autorizado, você receberá um código de acesso.";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [etapa, setEtapa] = useState<Etapa>("email");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function enviarCodigo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (carregando) return;

        setCarregando(true);
        setErro("");
        setMensagem("");

        const emailNormalizado = email.trim().toLowerCase();

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: emailNormalizado,
                type: "sign-in",
            });

            if (error) {
                setErro("Não foi possível solicitar o código. Tente novamente mais tarde.");
                return;
            }

            setEmail(emailNormalizado);
            setEtapa("codigo");
            setMensagem(MENSAGEM_GENERICA);
        } catch {
            setErro("Erro de comunicação. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    }

    async function verificarCodigo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (carregando) return;

        setCarregando(true);
        setErro("");
        setMensagem("");

        try {
            const { error } = await authClient.signIn.emailOtp({
                email,
                otp: codigo.trim(),
            });

            if (error) {
                setErro("Código inválido, expirado ou acesso não autorizado.");
                return;
            }

            // Navegação completa para que o middleware
            // receba os cookies de sessão atualizados.
            window.location.assign("/admin");
        } catch {
            setErro("Não foi possível verificar o código.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <section className="w-full max-w-md space-y-6 rounded-2xl border p-8">
                <div>
                    <h1 className="text-2xl font-semibold">Administração Moveo Motors</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {etapa === "email"
                            ? "Informe seu email para receber um código de acesso."
                            : `Digite o código enviado para ${email}.`}
                    </p>
                </div>

                {etapa === "email" ? (
                    <form onSubmit={enviarCodigo} className="space-y-4">
                        <label className="block space-y-2">
                            <span className="text-sm">Email</span>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={carregando}
                                className="w-full rounded-lg border p-3"
                                placeholder="admin@exemplo.com"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
                        >
                            {carregando ? "Enviando..." : "Enviar código"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verificarCodigo} className="space-y-4">
                        <label className="block space-y-2">
                            <span className="text-sm">Código de acesso</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                required
                                value={codigo}
                                onChange={(event) =>
                                    setCodigo(event.target.value.replace(/\D/g, ""))
                                }
                                disabled={carregando}
                                className="w-full rounded-lg border p-3 text-center text-xl tracking-widest"
                                placeholder="000000"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={carregando || codigo.length !== 6}
                            className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
                        >
                            {carregando ? "Verificando..." : "Verificar e entrar"}
                        </button>

                        <button
                            type="button"
                            disabled={carregando}
                            onClick={() => {
                                setEtapa("email");
                                setCodigo("");
                                setErro("");
                                setMensagem("");
                            }}
                            className="w-full text-sm underline"
                        >
                            Voltar e solicitar outro código
                        </button>
                    </form>
                )}

                {mensagem && (
                    <p role="status" className="text-sm text-green-700">
                        {mensagem}
                    </p>
                )}

                {erro && (
                    <p role="alert" className="text-sm text-red-600">
                        {erro}
                    </p>
                )}
            </section>
        </main>
    );
}
