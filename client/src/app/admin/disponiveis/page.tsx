"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
    ArrowLeft,
    Edit,
    CheckCircle,
    Eye
} from "lucide-react";

import type { Veiculo } from "../../../types/veiculo";

function gerarSlug(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

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
                            <div
                                key={veiculo.id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-xl font-bold text-gray-900">
                                    {veiculo.nome}
                                </h2>

                                <p className="flex flex-wrap gap-1.5 mb-5 text-sm text-gray-500">
                                    <span>{veiculo.ano}</span>
                                    <span>&#8226;</span>
                                    <span>{veiculo.km} km</span>
                                    <span>&#8226;</span>
                                    <span>{veiculo.cambio}</span>
                                </p>

                                <p className="mt-2 font-semibold text-gray-900">
                                    R$ {veiculo.preco.toLocaleString("pt-BR")}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    <Link
                                        href={`/admin/veiculos/${veiculo.id}/editar`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => marcarComoVendido(veiculo.id)}
                                        className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                                    >
                                        <CheckCircle size={16} />
                                        Vendido
                                    </button>

                                    <Link
                                        href={`/estoque/${gerarSlug(`${veiculo.nome}-${veiculo.ano}`)}-${veiculo.id}`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-800"
                                    >
                                        <Eye size={16} />
                                        Detalhes
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}