"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import VehicleCard from "../../../components/estoque/VehicleCard";
import Filters, {
    FILTROS_INICIAIS,
    filtrar,
    type FilterState,
} from "../../../components/estoque/Filters";
import { veiculos } from "../../../data/veiculos";

type Ordenacao = "recentes" | "preco-asc" | "preco-desc" | "km-asc" | "ano-desc";

const OPCOES_ORDENACAO: Record<Ordenacao, string> = {
    recentes: "Recentes",
    "preco-asc": "Menor preço",
    "preco-desc": "Maior preço",
    "km-asc": "Menor km",
    "ano-desc": "Mais novos",
};

export default function EstoquePage() {
    const [filtros, setFiltros] = useState<FilterState>(FILTROS_INICIAIS);
    const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");
    const [filtrosMobileAberto, setFiltrosMobileAberto] = useState(false);

    const resultados = useMemo(() => {
        const filtrados = filtrar(veiculos, filtros);
        const ordenados = [...filtrados];
        switch (ordenacao) {
            case "preco-asc": ordenados.sort((a, b) => a.preco - b.preco); break;
            case "preco-desc": ordenados.sort((a, b) => b.preco - a.preco); break;
            case "km-asc": ordenados.sort((a, b) => a.km - b.km); break;
            case "ano-desc": ordenados.sort((a, b) => b.ano - a.ano); break;
            default: ordenados.sort((a, b) => b.id - a.id);
        }
        return ordenados;
    }, [filtros, ordenacao]);

    const chipsAtivos = useMemo(() => construirChipsAtivos(filtros), [filtros]);
    const removerChip = (chave: keyof FilterState) =>
        setFiltros({ ...filtros, [chave]: FILTROS_INICIAIS[chave] });

    return (
        <div className="min-h-screen bg-[#F5F5F2] text-black selection:bg-[#D9A300] selection:text-black pt-20">
            <Header />

            {/* Page header */}
            <header className="max-w-7xl mx-auto px-6 pt-10 pb-6">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-2">
                    Catálogo · {resultados.length} de {veiculos.length} veículos
                </p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Estoque</h1>
            </header>

            <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                {/* Sidebar (desktop) */}
                <div className="hidden lg:block">
                    <Filters veiculos={veiculos} valor={filtros} aoMudar={setFiltros} />
                </div>

                {/* Results */}
                <main>
                    {/* Toolbar: chips + mobile filter toggle + sort */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setFiltrosMobileAberto(true)}
                                className="lg:hidden inline-flex items-center gap-2 h-9 px-3 rounded-full border border-black text-sm font-bold"
                            >
                                <SlidersHorizontal size={15} />
                                Filtros
                                {chipsAtivos.length > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#D9A300] text-black text-[11px] font-black">
                                        {chipsAtivos.length}
                                    </span>
                                )}
                            </button>

                            {chipsAtivos.map((chip) => (
                                <span
                                    key={String(chip.chave)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold pl-3 pr-1.5 py-1 rounded-full bg-black text-white"
                                >
                                    {chip.rotulo}
                                    <button
                                        onClick={() => removerChip(chip.chave)}
                                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/15"
                                        aria-label={`Remover filtro: ${chip.rotulo}`}
                                    >
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="relative shrink-0">
                            <select
                                value={ordenacao}
                                onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
                                className="h-10 pl-4 pr-9 rounded-xl border border-gray-200 bg-white text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#D9A300]"
                            >
                                {Object.entries(OPCOES_ORDENACAO).map(([k, v]) => (
                                    <option key={k} value={k}>Ordenar: {v}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Grid / empty state */}
                    {resultados.length === 0 ? (
                        <EstadoVazio aoLimpar={() => setFiltros(FILTROS_INICIAIS)} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {resultados.map((v) => (
                                <VehicleCard key={v.id} veiculo={v} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />

            {/* Filtros mobile (drawer) */}
            {filtrosMobileAberto && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setFiltrosMobileAberto(false)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-[#F5F5F2] overflow-y-auto">
                        <div className="sticky top-0 bg-[#F5F5F2] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                            <span className="font-black uppercase tracking-widest text-sm">Filtros</span>
                            <button
                                onClick={() => setFiltrosMobileAberto(false)}
                                className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center"
                                aria-label="Fechar filtros"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4">
                            <Filters veiculos={veiculos} valor={filtros} aoMudar={setFiltros} />
                            <button
                                onClick={() => setFiltrosMobileAberto(false)}
                                className="mt-6 w-full h-12 rounded-xl bg-black text-[#D9A300] font-black uppercase tracking-wider"
                            >
                                Ver {resultados.length} veículos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Active-filter chip helpers ---------------------------------------------

function construirChipsAtivos(f: FilterState): Array<{ chave: keyof FilterState; rotulo: string }> {
    const chips: Array<{ chave: keyof FilterState; rotulo: string }> = [];

    if (f.busca) chips.push({ chave: "busca", rotulo: `"${f.busca}"` });
    if (f.marca) chips.push({ chave: "marca", rotulo: f.marca });

    if (f.precoMax !== FILTROS_INICIAIS.precoMax)
        chips.push({ chave: "precoMax", rotulo: `Até R$ ${f.precoMax.toLocaleString("pt-BR")}` });

    if (f.anoMin !== FILTROS_INICIAIS.anoMin || f.anoMax !== FILTROS_INICIAIS.anoMax)
        chips.push({ chave: "anoMin", rotulo: `${f.anoMin}–${f.anoMax}` });

    if (f.kmMax !== FILTROS_INICIAIS.kmMax)
        chips.push({ chave: "kmMax", rotulo: `Até ${(f.kmMax / 1000).toFixed(0)}k km` });

    if (f.cambio.length > 0) chips.push({ chave: "cambio", rotulo: f.cambio.join(" / ") });
    if (f.combustivel.length > 0) chips.push({ chave: "combustivel", rotulo: f.combustivel.join(" / ") });
    if (f.aceitaTroca) chips.push({ chave: "aceitaTroca", rotulo: "Aceita troca" });
    if (f.ipvaPago) chips.push({ chave: "ipvaPago", rotulo: "IPVA pago" });

    return chips;
}

// --- Empty state ------------------------------------------------------------

function EstadoVazio({ aoLimpar }: { aoLimpar: () => void }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 md:p-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFFBEA] text-[#D9A300] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
            </div>
            <h2 className="text-2xl font-black mt-5">Nenhum veículo bateu com a sua busca.</h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                Tente afrouxar os filtros — entram veículos novos toda semana.
            </p>
            <button
                onClick={aoLimpar}
                className="mt-7 h-11 px-6 rounded-xl bg-[#D9A300] text-black font-black text-xs uppercase tracking-wider"
            >
                Limpar filtros
            </button>
        </div>
    );
}