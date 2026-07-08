"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../Header";
import {
    Calendar,
    Gauge,
    Settings,
    Fuel,
    Wrench,
    Share2,
    ArrowRight,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Check
} from "lucide-react";

import type { Veiculo } from "../../types/veiculo";

type VehicleDetailsClientProps = {
    veiculo: Veiculo;
};

export default function VehicleDetailsClient({ veiculo }: VehicleDetailsClientProps) {
    const [copiado, setCopiado] = useState(false);
    const [imagemAtual, setImagemAtual] = useState(0);

    const imagens = veiculo.imagens?.length
        ? veiculo.imagens.map((imagem) => imagem.url)
        : ["/placeholder-carro.png"];

    async function copiarLink() {
        await navigator.clipboard.writeText(window.location.href);

        setCopiado(true);

        setTimeout(() => {
            setCopiado(false);
        }, 3000);
    }

    const imagemAnterior = () => {
        setImagemAtual((atual) => atual === 0 ? imagens.length-1 : atual-1);
    };

    const proximaImagem = () => {
        setImagemAtual((atual) => atual === imagens.length-1 ? 0 : atual+1);
    };

    return (
        <main className="min-h-screen bg-[#F5F5F2] pt-20">
            <Header />

            <div className="mx-auto max-w-7xl">
                <section className="px-4 py-8">
                    <div className="mb-6">
                        <Link
                            href="/estoque"
                            className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                        >
                            <ArrowLeft size={22} /> Voltar para estoque
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                                <div className="relative aspect-video bg-[#f7f7f7]">
                                    <img
                                        src={imagens[imagemAtual]}
                                        alt={veiculo.nome}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    
                                    <button
                                        onClick={imagemAnterior}
                                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black"
                                    >
                                        <ChevronLeft size={28} />
                                    </button>

                                    <button
                                        onClick={proximaImagem}
                                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black"
                                    >
                                        <ChevronRight size={28} />
                                    </button>

                                    <div className="absolute right-4 top-4 rounded-full bg-black/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                                        {imagemAtual + 1} / {imagens.length}
                                    </div>
                                </div>

                                <div className="flex gap-3 overflow-x-auto p-4">
                                    {imagens.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setImagemAtual(index)}
                                            className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${imagemAtual === index
                                                ? "border-[#D9A300]"
                                                : "border-transparent hover:border-gray-300"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Miniatura ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-black">{veiculo.nome}</h1>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {veiculo.km.toLocaleString("pt-BR")} km
                                        </p>
                                    </div>

                                    <div className="relative flex gap-3 text-gray-500">
                                        <button
                                            onClick={copiarLink}
                                            className="transition hover:text-black"
                                        >
                                            <Share2 size={25} />
                                        </button>

                                        {copiado && (
                                            <span className="absolute right-0 top-8 whitespace-nowrap rounded-lg bg-black px-3 py-2 text-xs font-medium text-white shadow-lg">
                                            Link copiado!
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="flex flex-wrap gap-1.5 mb-5 text-sm text-gray-500">
                                    <span>{veiculo.cor}</span>
                                    <span>&#8226;</span>
                                    <span>Placa final {veiculo.final_placa}</span>
                                    <span>&#8226;</span>
                                    <span>{veiculo.estado_ipva ? "IPVA pago" : "IPVA pendente"}</span>
                                </p>

                                <div className="mb-6 rounded-2xl border-2 border-[#D9A300] bg-[#FFFBEA] px-6 py-4">
                                    <strong className="text-4xl font-semibold text-black">
                                        R$ {veiculo.preco.toLocaleString("pt-BR")}
                                    </strong>
                                </div>

                                <a
                                    href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no veículo ${veiculo.nome}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-full bg-[#111111] gap-1.5 px-8 py-4 font-semibold text-[#D9A300] transition hover:bg-[#D9A300] hover:text-black"
                                >
                                    Tenho interesse <ArrowRight size={22} />
                                </a>
                            </div>

                            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-5 text-2xl font-semibold text-black">Ficha técnica</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Ano", valor: String(veiculo.ano), icon: Calendar },
                                        { label: "Quilometragem", valor: `${veiculo.km.toLocaleString("pt-BR")} km`, icon: Gauge },
                                        { label: "Câmbio", valor: veiculo.cambio, icon: Settings },
                                        { label: "Combustível", valor: veiculo.combustivel, icon: Fuel },
                                        { label: "Motor", valor: veiculo.motor, icon: Wrench },
                                    ].map(({ label, valor, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4"
                                        >
                                            <div className="-ml-4 flex items-center gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9A300]/10 text-[#D9A300]">
                                                    <Icon size={21}/>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        {label}
                                                    </p>

                                                    <p className="truncate text-sm font-semibold text-black">
                                                        {valor || "Não informado"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-2xl font-semibold text-black">Outras informações</h2>

                        <div className="space-y-3">
                            <p className="leading-7 text-gray-700">
                                {veiculo.descricao ?? "Veículo em ótimo estado de conservação."}
                            </p>

                            {veiculo.outras_infos && veiculo.outras_infos.length > 0 && (
                                <ul className="space-y-2 pt-2">
                                    {veiculo.outras_infos.map((info, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2 text-gray-700"
                                        >
                                            <Check size={18} className="text-black" />
                                            {info}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}