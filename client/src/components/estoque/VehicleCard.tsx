"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import type { Veiculo } from "../../types/veiculo";

type VehicleCardProps = {
    veiculo: Veiculo;
};

export default function VehicleCard({ veiculo }: VehicleCardProps) {
    const imagens =
        veiculo.imagens && veiculo.imagens.length > 0
            ? veiculo.imagens
            : veiculo.imagem
                ? [veiculo.imagem]
                : ["/placeholder-carro.png"];

    const [imagemAtual, setImagemAtual] = useState(0);
    const [mouseEmCima, setMouseEmCima] = useState(false);

    useEffect(() => {
        if (!mouseEmCima || imagens.length <= 1) return;

        const intervalo = setInterval(() => {
            setImagemAtual((imagemAnterior) => (imagemAnterior + 1) % imagens.length);
        }, 1500);

        return () => clearInterval(intervalo);
    }, [mouseEmCima, imagens.length]);

    return (
        <div
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300"
            onMouseEnter={() => setMouseEmCima(true)}
            onMouseLeave={() => {
                setMouseEmCima(false);
                setImagemAtual(0);
            }}
        >
            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                {imagens.map((imagem, index) => (
                    <img
                        key={imagem}
                        src={imagem}
                        alt={veiculo.nome}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === imagemAtual ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))}

                {imagens.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {imagens.map((_, index) => (
                            <span
                                key={index}
                                className={`h-2 rounded-full transition-all duration-500 ${index === imagemAtual
                                    ? "w-6 bg-[#D9A300]"
                                    : "w-2 bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-5 space-y-3">
                <h3 className="text-xl font-semibold text-black">
                    {veiculo.nome}
                </h3>

                <p className="text-2xl font-bold text-[#D9A300]">
                    R$ {veiculo.preco.toLocaleString("pt-BR")}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                    <span>
                        <strong>{veiculo.ano}</strong>
                    </span>

                    <span>&#8226;</span>

                    <span>
                        <strong>{veiculo.km.toLocaleString("pt-BR")} km</strong>
                    </span>

                    <span>&#8226;</span>

                    <span>
                        <strong>{veiculo.combustivel}</strong>
                    </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Link
                        href={`/estoque/${veiculo.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#D9A300] bg-white py-3 font-medium text-[#D9A300] transition-all duration-300 hover:border-[#C89200] hover:bg-[#C89200] hover:text-black"
                    >
                        Mais detalhes
                        <ChevronsRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}