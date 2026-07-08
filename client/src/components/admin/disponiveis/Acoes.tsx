"use client";

import Link from "next/link";
import { 
    Edit,
    CheckCircle,
    Eye
} from "lucide-react";

import type { Veiculo } from "../../../types/veiculo";

type AcoesProps = {
    veiculo: Veiculo;
    marcarComoVendido: (id: number) => void;
}

function gerarSlug(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function Acoes({ veiculo, marcarComoVendido }: AcoesProps) {    
    return (
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
                    href={`/admin/editar/${veiculo.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                    <Edit size={16} />
                    Editar
                </Link>

                <Link
                    href={`/estoque/${gerarSlug(`${veiculo.nome}-${veiculo.ano}`)}-${veiculo.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-800"
                >
                    <Eye size={16} />
                    Detalhes
                </Link>

                <button
                    type="button"
                    onClick={() => marcarComoVendido(veiculo.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                >
                    <CheckCircle size={16} />
                    Vendido
                </button>
            </div>
        </div>
    )
}