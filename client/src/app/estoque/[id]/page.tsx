"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import {
    Calendar,
    Gauge,
    Settings,
    Fuel,
    Wrench,
    CarFront,
    Share2,
    ArrowRight,
    ArrowLeft,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { veiculos } from "../../../data/veiculos";

export default function VehicleDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);
    const veiculo = veiculos.find((item) => item.id === Number(id));

    const [copiado, setCopiado] = useState(false);

    async function copiarLink() {
        await navigator.clipboard.writeText(window.location.href);

        setCopiado(true);

        setTimeout(() => {
            setCopiado(false);
        }, 3000);
    }

    if (!veiculo) {
        notFound();
    }

    const imagens = veiculo.imagens?.length ? veiculo.imagens : [veiculo.imagem];
    const [imagemAtual, setImagemAtual] = useState(0);

    const imagemAnterior = () => {
        setImagemAtual((atual) => atual === 0 ? imagens.length-1 : atual-1);
    };

    const proximaImagem = () => {
        setImagemAtual((atual) => atual === imagens.length-1 ? 0 : atual+1);
    };

    return (
        <main className="min-h-screen bg-[#F5F5F2] pt-20">
            <Header />

            <section className="mx-auto max-w-6xl px-4 py-8">
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
                            <div className="relative aspect-[4/3] bg-[#f7f7f7]">
                                <img
                                    src={imagens[imagemAtual]}
                                    alt={veiculo.nome}
                                    className="h-full w-full object-contain"
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
                                <span>{veiculo.lugares} lugares</span>
                                <span>&#8226;</span>
                                <span>{veiculo.estado_ipva ? "IPVA pago" : "IPVA pendente"}</span>
                                <span>&#8226;</span>
                                <span>{veiculo.aceita_troca ? "Aceita troca" : "Não aceita troca"}</span>
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

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black"> 
                                    <Calendar size={18} className="shrink-0" /> {String(veiculo.ano)} 
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black"> 
                                    <Gauge size={18} className="shrink-0" /> {veiculo.km.toLocaleString("pt-BR")} km 
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black"> 
                                <Settings size={18} className="shrink-0" /> {veiculo.cambio} 
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black"> 
                                    <Fuel size={18} className="shrink-0" /> {veiculo.combustivel} 
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black"> 
                                    <Wrench size={18} className="shrink-0" /> {veiculo.motor} 
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black"> 
                                    <CarFront size={18} className="shrink-0" /> {veiculo.portas} portas 
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-2xl font-semibold text-black">Outras informações</h2>
                            <p className="leading-7 text-gray-700">
                                {veiculo.descricao ?? "Veículo em ótimo estado de conservação."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}