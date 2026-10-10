"use client";

import { useState } from "react";
import { authClient } from "../../lib/auth/client";

export default function LogoutButton() {
    const [saindo, setSaindo] = useState(false);
    const [erro, setErro] = useState("");

    async function handleLogout() {
        if (saindo) return;

        setSaindo(true);
        setErro("");

        try {
            const { error } = await authClient.signOut();

            if (error) {
                setErro("Não foi possível encerrar a sessão.");
                return;
            }

            window.location.replace("/admin/login");
        } catch {
            setErro("Erro de comunicação ao sair.");
        } finally {
            setSaindo(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={handleLogout}
                disabled={saindo}
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
                {saindo ? "Saindo..." : "Sair"}
            </button>

            {erro && (
                <p role="alert" className="text-sm text-red-600">
                    {erro}
                </p>
            )}
        </div>
    );
}
