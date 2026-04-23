"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Calendar,
    Gauge,
    Settings,
    Fuel,
    Wrench,
    CarFront,
    Share2,
    Bookmark,
} from "lucide-react";
import { veiculos } from "../../../data/veiculos";

export default function VehicleDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const veiculo = veiculos.find((item) => item.id === Number(params.id));

    if (!veiculo) notFound();

    const imagens = veiculo.imagens?.length ? veiculo.imagens : [veiculo.imagem];
    const [imagemAtual, setImagemAtual] = useState(0);

    return (
        <main className="min-h-screen bg-[#F5F5F2]">
            <section className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <Link
                        href="/estoque"
                        className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                        ← Voltar para estoque
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

                                <div className="flex gap-3 text-gray-500">
                                    <button className="transition hover:text-black">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="transition hover:text-black">
                                        <Bookmark size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="mb-5 text-sm text-gray-500">
                                {veiculo.cor ?? "Branco"} • Final 7 • 5 lugares • IPVA pago • Aceita troca
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
                                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-8 py-4 font-semibold text-[#D9A300] transition hover:bg-[#D9A300] hover:text-black"
                            >
                                Tenho interesse →
                            </a>
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-2xl font-semibold text-black">Ficha técnica</h2>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <InfoItem icon={<Calendar size={18} />} label={String(veiculo.ano)} />
                                <InfoItem icon={<Gauge size={18} />} label={`${veiculo.km.toLocaleString("pt-BR")} km`} />
                                <InfoItem icon={<Settings size={18} />} label={veiculo.cambio ?? "Manual"} />
                                <InfoItem icon={<Fuel size={18} />} label={veiculo.combustivel} />
                                <InfoItem icon={<Wrench size={18} />} label={veiculo.motor ?? "1.0"} />
                                <InfoItem icon={<CarFront size={18} />} label={veiculo.portas ?? "4 portas"} />
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

function InfoItem({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-4 text-sm font-medium text-black">
            <span className="text-gray-600">{icon}</span>
            <span>{label}</span>
        </div>
    );
}