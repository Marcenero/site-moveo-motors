"use client";

import { useState } from "react";
import {
    CalendarDays,
    Fuel,
    Gauge,
    MessageCircle,
    Settings2,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Check,
} from "lucide-react";

import Header from "../Header";
import Footer from "../Footer";
import Breadcrumbs from "../estoque/Breadcrumbs";

import type { Veiculo } from "../../types/veiculo";

type Props = {
    veiculo: Veiculo;
};

export default function VehicleDetailsClient({ veiculo }: Props) {
    const [imagemAtiva, setImagemAtiva] = useState(0);

    const imagens =
        veiculo.imagens?.length > 0
            ? veiculo.imagens
            : [{ url: "/placeholder-car.png" }];

    function imagemAnterior() {
        setImagemAtiva((atual) =>
            atual === 0 ? imagens.length - 1 : atual - 1
        );
    }

    function proximaImagem() {
        setImagemAtiva((atual) =>
            atual === imagens.length - 1 ? 0 : atual + 1
        );
    }

    const mensagemWhatsApp = encodeURIComponent(
        //Colocar também o link da página do veículo
        `Olá! Tenho interesse no ${veiculo.nome}. Gostaria de mais informações.`
    );

    return (
        <div className="min-h-screen bg-[#f5f5f2] text-black pt-20">
            <Header />

            {/* Breadcrumb */}
            <div className="pt-6">
                <Breadcrumbs
                    items={[
                        { label: "Início", href: "/" },
                        { label: "Estoque", href: "/estoque" },
                        { label: veiculo.nome },
                    ]}
                />
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-6 pb-20">
                {/* Área principal */}
                <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-10 items-start">

                    {/* Galeria */}
                    <div className="min-w-0">
                        <div className="relative overflow-hidden rounded-3xl bg-[#e9e9e5] aspect-[4/3] group">
                            <img
                                src={imagens[imagemAtiva]?.url}
                                alt={`${veiculo.nome} - foto ${imagemAtiva + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {imagens.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={imagemAnterior}
                                        aria-label="Imagem anterior"
                                        className="
                                            absolute left-4 top-1/2 -translate-y-1/2
                                            w-11 h-11
                                            flex items-center justify-center
                                            rounded-full
                                            bg-white/90
                                            shadow-lg
                                            opacity-0 group-hover:opacity-100
                                            hover:bg-white
                                            transition
                                        "
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={proximaImagem}
                                        aria-label="Próxima imagem"
                                        className="
                                            absolute right-4 top-1/2 -translate-y-1/2
                                            w-11 h-11
                                            flex items-center justify-center
                                            rounded-full
                                            bg-white/90
                                            shadow-lg
                                            opacity-0 group-hover:opacity-100
                                            hover:bg-white
                                            transition
                                        "
                                    >
                                        <ChevronRight size={20} />
                                    </button>

                                    <div className="
                                        absolute bottom-4 right-4
                                        rounded-full
                                        bg-black/70 text-white
                                        px-3 py-1.5
                                        text-xs font-bold
                                    ">
                                        {imagemAtiva + 1} / {imagens.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Miniaturas */}
                        {imagens.length > 1 && (
                            <div className="
                                flex gap-3 mt-4
                                overflow-x-auto
                                pb-2
                            ">
                                {imagens.map((imagem, index) => (
                                    <button
                                        type="button"
                                        key={`${imagem.url}-${index}`}
                                        onClick={() => setImagemAtiva(index)}
                                        className={`
                                            shrink-0
                                            w-24 h-20
                                            rounded-xl
                                            overflow-hidden
                                            border-2
                                            transition
                                            ${
                                                imagemAtiva === index
                                                    ? "border-[#d9a300]"
                                                    : "border-transparent hover:border-gray-300"
                                            }
                                        `}
                                    >
                                        <img
                                            src={imagem.url}
                                            alt={`${veiculo.nome} - miniatura ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Painel do veículo */}
                    <aside className="lg:sticky lg:top-28">
                        <div className="
                            bg-white
                            rounded-3xl
                            border border-black/5
                            shadow-[0_16px_50px_rgba(0,0,0,0.06)]
                            p-6 md:p-8
                        ">
                            <p className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.3em]
                                text-[#b98a00]
                                mb-3
                            ">
                                Veículo selecionado
                            </p>

                            <h1 className="
                                text-3xl md:text-4xl
                                font-black
                                tracking-tight
                                leading-[1.05]
                            ">
                                {veiculo.nome}
                            </h1>

                            {/* Preço */}
                            <div className="mt-7 pb-7 border-b border-gray-100">
                                <p className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    font-bold
                                    text-gray-400
                                    mb-1
                                ">
                                    Por
                                </p>

                                <p className="
                                    text-3xl md:text-4xl
                                    font-black
                                    tracking-tight
                                ">
                                    {veiculo.preco.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </div>

                            {/* Características principais */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-7">
                                <Caracteristica
                                    icone={<CalendarDays size={19} />}
                                    label="Ano"
                                    valor={String(veiculo.ano)}
                                />

                                <Caracteristica
                                    icone={<Gauge size={19} />}
                                    label="Quilometragem"
                                    valor={`${veiculo.km.toLocaleString("pt-BR")} km`}
                                />

                                <Caracteristica
                                    icone={<Settings2 size={19} />}
                                    label="Câmbio"
                                    valor={veiculo.cambio}
                                />

                                <Caracteristica
                                    icone={<Fuel size={19} />}
                                    label="Combustível"
                                    valor={veiculo.combustivel}
                                />
                            </div>

                            {veiculo.estado_ipva && (
                                <div className="
                                    flex items-center gap-3
                                    rounded-2xl
                                    bg-[#fff9df]
                                    px-4 py-3.5
                                    mb-6
                                ">
                                    <div className="
                                        w-9 h-9
                                        shrink-0
                                        rounded-full
                                        bg-[#d9a300]
                                        flex items-center justify-center
                                    ">
                                        <ShieldCheck size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black">
                                            IPVA pago
                                        </p>

                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Mais tranquilidade para você.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="space-y-3">
                                <a
                                    href={`https://wa.me/55NUMERO?text=${mensagemWhatsApp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        w-full h-14
                                        flex items-center justify-center gap-2
                                        rounded-xl
                                        border-2 border-black
                                        bg-white text-black
                                        font-black
                                        text-sm uppercase
                                        tracking-wider
                                        hover:bg-black
                                        hover:text-white
                                        transition-colors
                                    "
                                >
                                    <MessageCircle size={19} />
                                    Tenho interesse
                                </a>
                            </div>

                            <p className="
                                mt-5
                                text-center
                                text-xs
                                leading-relaxed
                                text-gray-400
                            ">
                                Consulte disponibilidade e condições com nossa equipe.
                            </p>
                        </div>
                    </aside>
                </section>

                {/* Ficha técnica */}
                <section className="mt-16 md:mt-20">
                    <div className="mb-7">
                        <p className="
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            font-black
                            text-[#b98a00]
                            mb-2
                        ">
                            Detalhes
                        </p>

                        <h2 className="
                            text-3xl md:text-4xl
                            font-black
                            tracking-tight
                        ">
                            Ficha técnica
                        </h2>
                    </div>

                    <div className="
                        bg-white
                        rounded-3xl
                        border border-gray-200
                        overflow-hidden
                    ">
                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-5
                        ">
                            <FichaTecnicaItem
                                label="Ano"
                                valor={String(veiculo.ano)}
                            />

                            <FichaTecnicaItem
                                label="Quilometragem"
                                valor={`${veiculo.km.toLocaleString("pt-BR")} km`}
                            />

                            <FichaTecnicaItem
                                label="Câmbio"
                                valor={veiculo.cambio}
                            />

                            <FichaTecnicaItem
                                label="Combustível"
                                valor={veiculo.combustivel}
                            />

                            <FichaTecnicaItem
                                label="Motor"
                                valor={veiculo.motor || "Não informado"}
                            />
                        </div>
                    </div>
                </section>

                {/* Outros detalhes */}
                <section className="mt-16 md:mt-20">
                    <div className="mb-7">
                        <p className="
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            font-black
                            text-[#b98a00]
                            mb-2
                        ">
                            Sobre o veículo
                        </p>

                        <h2 className="
                            text-3xl md:text-4xl
                            font-black
                            tracking-tight
                        ">
                            Outros detalhes
                        </h2>
                    </div>

                    <div className="
                        bg-white
                        rounded-3xl
                        border border-gray-200
                        overflow-hidden
                    ">
                        {/* Descrição */}
                        <div className="p-6 md:p-8 lg:p-10 lg:border-r border-gray-100">
                            <p className="
                                text-[10px] 
                                font-black 
                                uppercase 
                                tracking-[0.2em] 
                                text-gray-400 
                                mb-4
                            ">
                                Descrição
                            </p>

                            <p className="
                            text-gray-600
                            text-base
                            md:text-lg
                            leading-8
                            max-w-2xl
                        ">
                            {veiculo.descricao || "Veículo em ótimo estado de conservação."}
                        </p>
                        </div>

                        {/* Linha divisória */}
                        <div className="mx-auto border-t border-gray-200" />

                        {/* Detalhes extras */}
                        <div className="
                            p-6
                            md:p-8
                            lg:p-10
                            bg-white
                        ">
                            <p className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.2em]
                                text-gray-400
                                mb-5
                            ">
                                Mais detalhes
                            </p>

                            {veiculo.outras_infos &&
                            veiculo.outras_infos.length > 0 ?(
                                <ul className="space-y-4">
                                    {veiculo.outras_infos.map((info, index) => (
                                        <li
                                            key={`${info}-${index}`}
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                                text-sm
                                                md:text-base
                                                font-semibold
                                                text-gray-700
                                            "
                                        >
                                            <span className="
                                                mt-0.5
                                                w-6 h-6
                                                shrink-0
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-black
                                            ">
                                                <Check
                                                    size={24}
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            <span className="leading-6">
                                                {info}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    Nenhum detalhe adicional informado.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* CTA fixo somente no celular */}
            <div className="
                fixed
                left-0 right-0 bottom-0
                z-50
                lg:hidden
                bg-white/95
                backdrop-blur
                border-t border-gray-200
                p-3
            ">
                <a
                    href={`https://wa.me/55NUMERO?text=${mensagemWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        h-13
                        flex items-center justify-center gap-2
                        rounded-xl
                        bg-black
                        text-white
                        font-black
                        text-sm
                    "
                >
                    <MessageCircle size={18} />
                    Falar no WhatsApp
                </a>
            </div>

            <Footer />
        </div>
    );
}

function Caracteristica({
    icone,
    label,
    valor,
}: {
    icone: React.ReactNode;
    label: string;
    valor: string;
}) {
    return (
        <div className="flex gap-3 min-w-0">
            <div className="
                w-9 h-9
                shrink-0
                rounded-xl
                bg-[#f5f5f2]
                flex items-center justify-center
                text-[#a77b00]
            ">
                {icone}
            </div>

            <div className="min-w-0">
                <p className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-gray-400
                ">
                    {label}
                </p>

                <p className="
                    text-sm
                    font-black
                    mt-0.5
                    truncate
                ">
                    {valor}
                </p>
            </div>
        </div>
    );
}

function FichaTecnicaItem({
    label,
    valor,
}: {
    label: string;
    valor: string;
}) {
    return (
        <div className="
            px-6 py-6
            border-b
            sm:border-r
            border-gray-100
            last:border-r-0
        ">
            <p className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-gray-400
                mb-2
            ">
                {label}
            </p>

            <p className="text-lg font-black">
                {valor}
            </p>
        </div>
    );
}