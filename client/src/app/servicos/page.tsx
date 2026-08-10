"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const servicos: Servico[] = [
    {
        categoria: "Compra",
        titulo: "Seminovos premium",
        descricao: "Curadoria de carros, vistoria cautelar e laudo de procedência em todos os veículos antes de irem para o estoque.",
        itens: [
            "Vistoria cautelar inclusa",
            "Garantia mínima de 90 dias",
            "Histórico DETRAN auditado",
        ],
        botao: "Ver estoque",
        href: "/estoque",
        destaque: "white",
    },
    {
        categoria: "Venda",
        titulo: "Consignação inteligente",
        descricao: "Deixe o seu carro conosco. Fotografamos, anunciamos e negociamos por você, com repasse rápido e seguro.",
        itens: [
            "Fotografia profissional",
            "Anúncio em vários portais",
            "Comissão a partir de 4%",
        ],
        botao: "Quero consignar",
        href: "https://wa.me/5511999999999?text=Olá! Tenho interesse em consignar meu veículo.",
        destaque: "gold",
    },
    {
        categoria: "Avaliação",
        titulo: "Compro o seu usado",
        descricao: "Nós avaliamos seu carro e fazemos uma oferta justa. Pagamento em até 24h após a inspeção presencial.",
        itens: [
            "Resposta em até 24h",
            "Pagamento via PIX ou TED",
            "+5% acima da FIPE na troca",
        ],
        botao: "Avaliar grátis",
        href: "https://wa.me/5511999999999?text=Olá! Gostaria de avaliar meu usado.",
        destaque: "black",
    },
    {
        categoria: "Crédito",
        titulo: "Financiamento facilitado",
        descricao: "Trabalhamos com diversos bancos. Pré-aprovação online em minutos.",
        itens: [
            "Até 60x sem entrada",
            "Taxas a partir de 1,29% a.m.",
            "Aprovação online",
        ],
        botao: "Consultar agora",
        href: "https://wa.me/5511999999999?text=Olá! Gostaria de discutir um financiamento.",
        destaque: "white",
    },
];

type DestaqueServico = "white" | "gold" | "black";

type Servico = {
    categoria: string;
    titulo: string;
    descricao: string;
    itens: string[];
    botao: string;
    href: string;
    destaque: DestaqueServico;
};

export default function ServicosPage() {
    return (
        <main className="min-h-screen bg-[#F5F5F2] text-black pt-20">
            <Header />

            <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400 mb-4">
                        O que fazemos
                    </p>

                    <h1 className="max-w-4xl text-4xl md:text-6xl font-black tracking-tight leading-none">
                        Quatro serviços. 
                        <span className="text-[#D9A300]"> Um padrão.</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm md:text-base text-gray-600 leading-relaxed">
                        De compra a financiamento, cada operação passa pela mesma vistoria, a mesma curadoria e a mesma equipe.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {servicos.map((servico) => (
                        <ServicoCard key={servico.titulo} {...servico} />
                    ))}
                </div>

                <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 md:p-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400 mb-8">
                        Como funciona
                    </p>

                    <div className="relative space-y-8">
                        {[
                            {
                                numero: "01",
                                titulo: "Você chama a Moveo",
                                texto: "Entre em contato pelo WhatsApp ou escolha um veículo no estoque.",
                            },
                            {
                                numero: "02",
                                titulo: "Avaliamos o cenário",
                                texto: "Entendemos se você quer comprar, vender, trocar ou financiar.",
                            },
                            {
                                numero: "03",
                                titulo: "Cuidamos do processo",
                                texto: "A Moveo acompanha documentação, negociação e entrega do veículo.",
                            },
                        ].map((etapa, index, etapas) => (
                            <div key={etapa.numero} className="relative flex gap-5">
                                {index < etapas.length - 1 && (
                                    <div className="absolute left-3 top-7 h-[calc(100%+2rem)] w-px bg-gray-200" />
                                )}

                                <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white">
                                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                                </div>

                                <div>
                                    <span className="text-[#D9A300] font-black text-3xl">
                                        {etapa.numero}
                                    </span>

                                    <h3 className="mt-2 font-black text-xl">
                                        {etapa.titulo}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        {etapa.texto}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>

            <Footer />
        </main>
    );
}

function ServicoCard({
    categoria,
    titulo,
    descricao,
    itens,
    botao,
    href,
    destaque,
}: Servico) {
    const isGold = destaque === "gold";
    const isBlack = destaque === "black";

    return (
        <article
            className={[
                "rounded-3xl p-6 md:p-8 min-h-[200px] flex flex-col justify-between",
                isGold
                    ? "bg-[#D9A300] text-black"
                    : isBlack
                    ? "bg-[#111111] text-white"
                    : "bg-white text-black border border-gray-200",
            ].join(" ")}
        >
            <div>
                <p
                    className={[
                        "text-[10px] font-black uppercase tracking-[0.35em] mb-3",
                        isBlack ? "text-[#D9A300]" : "text-gray-500",
                    ].join(" ")}
                >
                    {categoria}
                </p>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    {titulo}
                </h2>

                <p
                    className={[
                        "mt-3 text-sm leading-relaxed max-w-xl",
                        isBlack ?"text-gray-300" : "text-gray-700"
                    ].join(" ")}
                >
                    {descricao}
                </p>

                <ul className="mt-5 space-y-2">
                    {itens.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm font-semibold">
                            <CheckCircle2 
                                size={16}
                                className={isBlack ? "text-[#D9A300]" : "text-black"}
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <Link
                href={href}
                target={href.startsWith("http")? "_blank" : undefined}
                className={[
                    "mt-7 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider transition",
                    isGold
                        ? "bg-black text-[#D9A300] hover:bg-white hover:text-black"
                        : isBlack
                        ? "bg-[#D9A300] text-black hover:bg-white"
                        : "bg-black text-white hover:bg-[#D9A300] hover:text-black",
                ].join(" ")}
            >
                {botao}
                <ArrowRight size={15} />
            </Link>
        </article>
    );
}