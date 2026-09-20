"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
    ArrowLeft,
} from "lucide-react";

import type { Veiculo } from "../../../types/veiculo";

import Acoes from "../../../components/admin/disponiveis/Acoes";
import { adminFetch } from "../../../lib/adminFetch";
import { logError } from "../../../lib/logger";
import { getPublicApiUrl } from "../../../lib/env.client";

async function buscarDisponiveis(): Promise<Veiculo[]> {
    const apiUrl = getPublicApiUrl();

    const resposta = await fetch(`${apiUrl}/veiculos`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar veículos disponíveis.");
    }

    const dados = await resposta.json();

    const lista = Array.isArray(dados)
        ? dados
        : Array.isArray(dados.veiculos)
            ? dados.veiculos
            : [];

    return lista.filter(
        (veiculo: Veiculo) => !veiculo.vendido
    );
}

export default function DisponiveisPage() {
    const router = useRouter();

    const [disponiveis, setDisponiveis] = useState<Veiculo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        buscarDisponiveis()
            .then((lista) => {
                if (ativo) {
                    setDisponiveis(lista);
                }
            })
            .catch((error) => {
                logError(
                    "available_vehicles_fetch_failed",
                    error,
                    {
                        component: "admin",
                        operation: "buscar_veiculos_disponiveis",
                    }
                );

                if (ativo) {
                    setErro("Não foi possível carregar os veículos.");
                }
            })
            .finally(() => {
                if (ativo) {
                    setCarregando(false);
                }
            });

        return () => {
            ativo = false;
        };
    }, []);

    async function marcarComoVendido(id: number): Promise<boolean> {
        setErro("");

        try {
            const resposta = await adminFetch(`/veiculos/${id}/vendido`,
                {
                    method: "PATCH",
                }
            );

            if (resposta.status === 401) {
                router.push("/admin/login");
                return false;
            }

            if (resposta.status === 403) {
                throw new Error("Você não possui permissão para marcar veículos como vendidos.");
            }

            if (!resposta.ok) {
                const dadosErro = await resposta
                    .json()
                    .catch(() => null);

                throw new Error(
                    dadosErro?.erro ||
                    dadosErro?.error ||
                    "Não foi possível marcar o veículo como vendido."
                );
            }

            setDisponiveis((atual) =>
                atual.filter(
                    (veiculo) => veiculo.id !== id
                )
            );

            return true;
        }
        catch (error) {
            logError(
                "vehicle_mark_sold_failed",
                error,
                {
                    component: "admin",
                    operation: "marcar_veiculo_vendido",
                }
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao marcar veículo como vendido."
            );

            return false;
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-6xl">
                <Link
                    href="/admin"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                >
                    <ArrowLeft size={22} /> Voltar para painel
                </Link>

                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    Veículos disponíveis
                </h1>

                {erro && (
                    <p
                        role="alert"
                        className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600"
                    >
                        {erro}
                    </p>
                )}

                {carregando ? (
                    <p className="text-sm text-gray-500">Carregando veículos...</p>
                ) : disponiveis.length === 0 ? (
                    <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                        Nenhum veículo disponível no momento.
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {disponiveis.map((veiculo) => (
                            <Acoes
                                key={veiculo.id}
                                veiculo={veiculo}
                                marcarComoVendido={marcarComoVendido}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}