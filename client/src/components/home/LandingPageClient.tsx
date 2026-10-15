"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import VehicleCard from "../estoque/listagem/VehicleCard";
import type { Veiculo } from "../../types/veiculo";
import { ArrowRight, MessageCircle, ShieldCheck, Zap, CalendarDays, Navigation } from "lucide-react";
import { IconPhone, IconMapPin, IconClock } from "@tabler/icons-react";
import { FaWhatsapp } from "react-icons/fa";

import { logError } from "../../lib/logger";
import { getPublicApiUrl } from "../../lib/env.client";

function VehicleCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg animate-pulse">
            {/* Imagem */}
            <div className="aspect-[16/10] w-full bg-gray-200" />

            {/* Informações */}
            <div className="space-y-4 p-5">
                {/* Nome */}
                <div className="h-6 w-3/4 rounded-md bg-gray-200" />

                {/* Preço */}
                <div className="h-8 w-1/2 rounded-md bg-gray-200" />

                {/* Ano / km / Combustível */}
                <div className="flex items-center gap-3">
                    <div className="h-4 w-14 rounded bg-gray-200" />
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                </div>

                {/* Botão */}
                <div className="pt-2">
                    <div className="h-12 w-full rounded-xl bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

function MapaSkeleton() {
    return (
        <div className="h-full min-h-[360px] w-full overflow-hidden rounded-2xl bg-gray-800 animate-pulse">
            <div className="flex h-full w-full items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 rounded-full bg-gray-700" />

                    <div className="mx-auto h-3 w-28 rounded bg-gray-700" />
                </div>
            </div>
        </div>
    );
}

const MapaLoja = dynamic(() => import("./MapaLoja"), {
    ssr: false,
    loading: () => <MapaSkeleton />,
});

const DADOS_LOJA = {
    endereco: "",
    horarioSemana: "",
    horarioSabado: "",
    telefone: "",
    whatsapp: "",
};

export default function LandingPage() {
    const router = useRouter();

    const [veiculosRecentes, setVeiculosRecentes] = useState<Veiculo[]>([]);
    const [carregandoRecentes, setCarregandoRecentes] = useState(true);
    const [mostrarWhatsapp, setMostrarWhatsapp] = useState(false);

    const mapsUrl = DADOS_LOJA.endereco.trim()
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DADOS_LOJA.endereco)}`
        : null;

    const wazeUrl = DADOS_LOJA.endereco.trim()
        ? `https://waze.com/ul?q=${encodeURIComponent(DADOS_LOJA.endereco)}&navigate=yes`
        : null;

    const whatsappUrl = DADOS_LOJA.whatsapp.trim()
        ? `https://wa.me/${DADOS_LOJA.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
            "Olá! Gostaria de agendar uma visita e um test-drive na Moveo Motors."
        )}`
        : null;

    useEffect(() => {
        async function buscarVeiculosRecentes() {
            try {
                const apiUrl = getPublicApiUrl();

                const resposta = await fetch(`${apiUrl}/veiculos`);

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar veículos");
                }

                const dados = await resposta.json();

                const lista: Veiculo[] = Array.isArray(dados)
                    ? dados
                    : Array.isArray(dados.veiculos)
                      ? dados.veiculos
                      : [];

                const destaques = [...lista].sort((a, b) => b.id - a.id).slice(0, 3);

                setVeiculosRecentes(destaques);
            } catch (error) {
                logError("featured_vehicles_fetch_failed", error, {
                    component: "home",
                    operation: "buscar_veiculos_destaque",
                });

                setVeiculosRecentes([]);
            } finally {
                setCarregandoRecentes(false);
            }
        }

        buscarVeiculosRecentes();
    }, []);

    useEffect(() => {
        const verificarScroll = () => {
            setMostrarWhatsapp(window.scrollY > 500);
        };

        verificarScroll();

        window.addEventListener("scroll", verificarScroll);

        return () => {
            window.removeEventListener("scroll", verificarScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-[#D9A300] selection:text-white">
            {/* --- HEADER / NAVIGATION --- */}
            <Header />

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[720px] md:min-h-screen py-28 md:py-0 flex items-center justify-center overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
                        alt="Carro de Luxo"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-20 container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="text-left">
                        {/* Pré-lançamento */}
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#d9a300]/40 bg-black/50 px-4 py-2 backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d9a300] opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d9a300]" />
                            </span>

                            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#d9a300]">
                                Site em pré-lançamento
                            </span>
                        </div>
                        
                        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95] tracking-tighter">
                            A EMOÇÃO DE <br />
                            <span className="text-[#D9A300] italic">DIRIGIR.</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-10 font-medium max-w-lg leading-relaxed">
                            Na <span className="text-[#D9A300] font-bold">MOVEO MOTORS</span>,
                            selecionamos apenas o melhor para você. Veículos premium com garantia e
                            procedência garantida.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push("/estoque")}
                                className="group bg-[#D9A300] hover:bg-white text-black px-10 py-5 rounded-xl text-lg font-black uppercase flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl"
                            >
                                Ver Estoque{" "}
                                <ArrowRight
                                    size={22}
                                    className="group-hover:translate-x-2 transition-transform"
                                />
                            </button>
                            <button className="border-2 border-white/30 hover:border-[#D9A300] text-white px-10 py-5 rounded-xl text-lg font-black uppercase transition-all hover:bg-white/5 cursor-not-allowed">
                                Avaliar Meu Usado
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO DE DESTAQUES --- */}
            <section id="estoque" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end md:mb-16 gap-6">
                        <div className="w-full md:w-auto">
                            <span className="text-[#D9A300] font-black tracking-widest uppercase text-sm">
                                Catálogo
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mt-2 leading-none">
                                Destaques Moveo
                            </h2>
                        </div>
                        <button
                            className="group flex items-center justify-between sm:justify-start w-full md:w-auto max-w-full gap-2 text-black font-black text-sm sm:text-lg border-b-4 border-[#D9A300] pb-1 hover:text-[#C89200] transition-colors"
                            onClick={() => router.push("/estoque")}
                        >
                            VER TODOS OS MODELOS{" "}
                            <ArrowRight
                                size={20}
                                className="shrink-0 md:group-hover:translate-x-2 transition-transform"
                            />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
                        {carregandoRecentes ? (
                            <>
                                <VehicleCardSkeleton />
                                <VehicleCardSkeleton />
                                <VehicleCardSkeleton />
                            </>
                        ) : veiculosRecentes.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Estamos atualizando nossos destaques. Veja todos os veículos
                                disponíveis no estoque.
                            </p>
                        ) : (
                            veiculosRecentes.map((veiculo) => (
                                <VehicleCard key={veiculo.id} veiculo={veiculo} />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO DE CONFIANÇA --- */}
            <section className="py-20 px-6 bg-black">
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#D9A300] to-[#FFFBEA] rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-black">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8 uppercase tracking-tighter">
                                Sua próxima conquista começa aqui.
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <p className="font-bold text-lg">
                                        Veículos selecionados com cuidado e transparência.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <p className="font-bold text-lg">
                                        Avaliação justa e personalizada do seu usado.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black p-8 rounded-3xl shadow-2xl">
                            <p className="text-[#D9A300] font-black text-2xl mb-4 italic uppercase">
                                Dúvidas?
                            </p>
                            <p className="text-gray-400 mb-8 font-medium">
                                Nossos especialistas estão prontos para encontrar o carro ideal para
                                si.
                            </p>
                            <button
                                className="w-full bg-green-500 text-white px-4 py-5 rounded-2xl font-black text-sm sm:text-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 sm:gap-3 text-center"
                                /*onClick={() =>
                                    window.open(
                                        "https://wa.me/5511999999999",
                                        "_blank",
                                        "noopener,noreferrer"
                                    )
                                }*/
                            >
                                <span className="shrink-0 text-xl sm:text-2xl">
                                    <FaWhatsapp />
                                </span>
                                <span className="leading-tight">CONTATO VIA WHATSAPP</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NOSSOS SERVIÇOS --- */}
            <section id="servicos" className="py-24 bg-gray-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-black text-5xl font-black uppercase italic tracking-tighter">
                            Serviços MOVEO
                        </h2>
                        <div className="h-2 w-24 bg-[#D9A300] mx-auto mt-4 rounded-full"></div>
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-tight mt-4 mb-6 leading-[0.95]">
                        Muito além de encontrar seu próximo carro.
                    </h2>

                    <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                        Conheça as soluções que a Moveo Motors oferece para tornar sua experiência
                        automotiva mais simples, segura e completa.
                    </p>

                    <Link
                        href="/servicos"
                        className="group inline-flex items-center gap-3 bg-[#D9A300] text-black px-8 py-4 rounded-xl font-black uppercase hover:bg-[#111111] hover:text-white transition-all"
                    >
                        Conhecer nossos Serviços
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-2 transition-transform"
                        />
                    </Link>
                </div>
            </section>

            {/* --- LOCALIZAÇÃO --- */}
            <section
                id="contato"
                className="scroll-mt-24 bg-black px-5 py-20 text-white sm:px-6 lg:py-28"
            >
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.2fr_0.95fr] lg:gap-12">
                    {/* Coluna esquerda */}
                    <div className="min-w-0">
                        {/* Cabeçalho */}
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#d9a300] sm:text-sm">
                            CONHEÇA A MOVEO MOTORS
                        </span>

                        <h2 className="mt-4 max-w-2xl text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                            Venha conhecer nossos veículos na loja.
                        </h2>

                        <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-400 sm:text-lg">
                            Sua próxima conquista merece uma experiência à altura.
                            Conheça nossos veículos, converse com nossa equipe e
                            descubra o carro ideal para você.
                        </p>

                        {/* Informações */}
                        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2">
                            {/* Endereço */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                    <IconMapPin 
                                        size={28}
                                        stroke={1.8}
                                        className="mt-1 shrink-0 text-[#d9a300]"
                                    />
                                </div>

                                <div>
                                    <h3 className="mb-2 text-lg font-bold text-white">
                                        Endereço
                                    </h3>

                                    <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                                        {DADOS_LOJA.endereco || "Em breve"}
                                    </p>
                                </div>
                            </div>

                            {/* Horário */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">   
                                    <IconClock 
                                        size={28}
                                        strokeWidth={1.8}
                                        className="mt-1 shrink-0 text-[#d9a300]"
                                    />
                                </div>

                                <div>
                                    <h3 className="mb-2 text-lg font-bold text-white">
                                        Horário
                                    </h3>

                                    <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                                        {DADOS_LOJA.horarioSemana || "Em breve"}
                                    </p>

                                    {DADOS_LOJA.horarioSabado && (
                                        <p className="mt-1 text-sm leading-relaxed text-gray-400 sm:text-base">
                                            {DADOS_LOJA.horarioSabado}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Telefone */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                    <IconPhone 
                                        size={28}
                                        strokeWidth={1.8}
                                        className="mt-1 shrink-0 text-[#d9a300]"
                                    />
                                </div>

                                <div>
                                    <h3 className="mb-2 text-lg font-bold text-white">
                                        Telefone
                                    </h3>

                                    {DADOS_LOJA.telefone ? (
                                        <a
                                            href={`tel:${DADOS_LOJA.telefone.replace(/\D/g, "")}`}
                                            className="text-sm text-gray-400 transition-colors hover:text-[#d9a300] sm:text-base"
                                        >
                                            {DADOS_LOJA.telefone}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-400 sm:text-base">
                                            Em breve
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Whatsapp */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                    <FaWhatsapp 
                                        size={28}
                                        strokeWidth={1.8}
                                        className="shrink-0 text-[#d9a300]"
                                    />
                                </div>

                                <div>
                                    <h3 className="mb-2 text-lg font-bold text-white">
                                        Whatsapp
                                    </h3>

                                    <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                                        {DADOS_LOJA.whatsapp
                                            ? "Atendimento online"
                                            : "Em breve"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                            {/* Agendamento */}
                            <button
                                type="button"
                                disabled={!whatsappUrl}
                                title={!whatsappUrl ? "Agendamento disponível em breve" : undefined}
                                onClick={() => {
                                    if (whatsappUrl) {
                                        window.open(
                                            whatsappUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                        );
                                    }
                                }}
                                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#d9a300] px-6 py-4 text-sm font-black uppercase shadow-lg transition-all enabled:hover:-translate-y-1 enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                <CalendarDays size={20} />
                                Agendar visita
                            </button>

                            {/* Rotas */}
                            {mapsUrl && wazeUrl ? (
                                <div className="flex flex-wrap items-center gap-4">
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-300 transition-colors hover:text-[#d9a300]"
                                    >
                                        <Navigation size={20} />
                                        Google Maps
                                    </a>

                                    <a
                                        href={wazeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-300 transition-colors hover:text-[#d9a300]"
                                    >
                                        Waze
                                    </a>
                                </div>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <Navigation size={20} />
                                    Rotas disponíveis em breve
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Coluna direita - Mapa */}
                    <div className="relative isolate z-0 min-w-0">
                        <div className="relative isolate z-0 h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#202b3d] shadow-2xl sm:h-[420px] lg:h-[440px]">
                            <MapaLoja />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <Footer />

            {/* Floating Action Button (WhatsApp) */}
            <a
                //href="https://wa.me/5511912345678"
                target="_blank"
                rel="noopener noreferrer"
                className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 bg-[#25D366] text-white p-4 sm:p-4 md:p-6 rounded-full shadow-[0_15px_40px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all z-[60] group animate-bounce transition-all duration-500 ease-out
            ${
                mostrarWhatsapp
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-10 pointer-events-none"
            }
          `}
            >
                <MessageCircle fill="white" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                <span className="hidden md:block absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-black text-white px-5 py-3 rounded-2xl text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 uppercase tracking-widest">
                    Falar com Especialista
                </span>
            </a>
        </div>
    );
}
