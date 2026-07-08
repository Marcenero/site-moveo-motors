"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
    ArrowLeft,
} from "lucide-react";

import type { Veiculo } from "../../../types/veiculo";

import Acoes from "../../../components/admin/disponiveis/Acoes";

export default function DisponiveisPage() {
    const [disponiveis, setDisponiveis] = useState<Veiculo[]>([]);
    const [carregando, setCarregando] = useState(true);

    async function buscarDisponiveis() {
        try {
            const resposta = await fetch("http://localhost:3001/veiculos");
            const dados = await resposta.json();

            const lista = Array.isArray(dados)
                ? dados
                : Array.isArray(dados.veiculos)
                    ? dados.veiculos
                    : [];

            setDisponiveis(lista.filter((veiculo: Veiculo) => !veiculo.vendido));
        }
        catch (error) {
            console.error("Erro ao buscar veículos disponíveis:", error);
        }
        finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarDisponiveis();
    }, []);

    async function marcarComoVendido(id: number) {
        try {
            await fetch(`http://localhost:3001/veiculos/${id}/vendido`, {
                method: "PATCH",
            });

            setDisponiveis((atual) =>
                atual.filter((veiculo) => veiculo.id !== id)
            );
        }
        catch (error) {
            console.error("Erro ao marcar como vendido:", error);
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