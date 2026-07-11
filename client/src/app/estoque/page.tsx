"use client";

import { useMemo, useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import VehicleCard from "../../components/estoque/VehicleCard";
import Filters, {
    FILTROS_INICIAIS,
    filtrar,
    type FilterState,
} from "../../components/estoque/Filters";
import { Veiculo } from "../../types/veiculo";

type Ordenacao = "recentes" | "preco-asc" | "preco-desc" | "km-asc" | "ano-desc";

const OPCOES_ORDENACAO: Record<Ordenacao, string> = {
    recentes: "Recentes",
    "preco-asc": "Menor preço",
    "preco-desc": "Maior preço",
    "km-asc": "Menor km",
    "ano-desc": "Mais novos",
};

export default function EstoquePage() {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function buscarVeiculos() {
            try {
                //Em produção, trocar por `${process.env.NEXT_PUBLIC_API_URL}/veiculos`
                const resposta = await fetch("http://localhost:3001/veiculos");
                const dados = await resposta.json();

                const lista = Array.isArray(dados)
                    ? dados
                    : Array.isArray(dados.veiculos)
                        ? dados.veiculos
                        : [];

                setVeiculos(lista);
            }
            catch (error) {
                console.error("Erro ao buscar veículos:", error);
            }
            finally {
                setCarregando(false);
            }
        }

        buscarVeiculos();
    }, []);

    const [filtros, setFiltros] = useState<FilterState>(FILTROS_INICIAIS);
    const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");
    const [filtrosMobileAberto, setFiltrosMobileAberto] = useState(false);

    const resultados = useMemo(() => {
        const listaVeiculos = Array.isArray(veiculos) ? veiculos: [];
        const filtrados = filtrar(listaVeiculos, filtros);
        const ordenados = [...filtrados];

        switch (ordenacao) {
            case "preco-asc": ordenados.sort((a, b) => a.preco - b.preco); break;
            case "preco-desc": ordenados.sort((a, b) => b.preco - a.preco); break;
            case "km-asc": ordenados.sort((a, b) => a.km - b.km); break;
            case "ano-desc": ordenados.sort((a, b) => b.ano - a.ano); break;
            default: ordenados.sort((a, b) => b.id - a.id);
        }

        return ordenados;
    }, [veiculos, filtros, ordenacao]);

    const chipsAtivos = useMemo(() => construirChipsAtivos(filtros), [filtros]);
    const removerChip = (chave: keyof FilterState) =>
        setFiltros({ ...filtros, [chave]: FILTROS_INICIAIS[chave] });

    return (
        <div className="min-h-screen bg-[#F5F5F2] text-black selection:bg-[#D9A300] selection:text-black pt-20">
            <Header />

            {/* Page header */}
            <header className="max-w-7xl mx-auto px-6 pt-10 pb-6">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-2">
                    Catálogo · Mostrando {resultados.length} veículos
                </p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Estoque</h1>
            </header>

            <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                {/* Sidebar (desktop) */}
                <div className="hidden lg:block">
                    <Filters 
                        veiculos={Array.isArray(veiculos) ? veiculos : []} 
                        valor={filtros} 
                        aoMudar={setFiltros} 
                    />
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

                        <div className="flex flex-col relative shrink-0">
                            <span className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                                Ordenar
                            </span>

                            <div className="relative">
                                <select
                                    value={ordenacao}
                                    onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
                                    className="h-10 pl-4 pr-9 rounded-xl border border-gray-200 bg-white text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#D9A300]"
                                >
                                    {Object.entries(OPCOES_ORDENACAO).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Grid / empty state */}
                    {carregando ? (
                        <p className="text-sm text-gray-500">Carregando veículos...</p>
                    ) : resultados.length === 0 ? (
                        <EstadoVazio 
                            aoLimpar={() => setFiltros(FILTROS_INICIAIS)} 
                            sugestoes={[...veiculos].sort((a, b) => b.id - a.id).slice(0, 3)}
                        />
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

//Active-filter chip helpers
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
    if (f.ipvaPago) chips.push({ chave: "ipvaPago", rotulo: "IPVA pago" });

    return chips;
}

//Estado vazio
function gerarSlug(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function EstadoVazio({
    aoLimpar,
    sugestoes,
}: {
    aoLimpar: () => void;
    sugestoes: Veiculo[];
}) {
    return (
        <div>
            <div className="mb-6">
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-gray-400 mb-2">
                    Estoque - Sem resultados
                </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 px-6 py-12 md:px-10 md:py-14 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FFFBEA] text-[#D9A300] flex items-center justify-center">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                </div>

                <h3 className="text-2xl font-black mt-6">
                    Nenhum veículo bateu com sua busca.
                </h3>

                <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                    Que tal afrouxar um pouco os filtros?
                </p>

                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={aoLimpar}
                        className="h-11 px-6 rounded-xl border border-black bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition"
                    >
                        Limpar filtros
                    </button>
                </div>

                <div className="mt-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        Talvez você goste de
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {sugestoes.map((veiculo) => {
                        const imagem = veiculo.imagens?.[0]?.url ?? "/placeholder-car.png";

                        return (
                            <a
                                key={veiculo.id}
                                href={`/estoque/${gerarSlug(veiculo.nome)}-${veiculo.id}`}
                                className="text-left rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition"
                            >
                                <div className="aspect-[4/3] bg-gray-100">
                                    <img 
                                        src={imagem}
                                        alt={veiculo.nome}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-3">
                                    <h4 className="text-sm font-black truncate">
                                        {veiculo.nome}
                                    </h4>

                                    <p className="text-xs text-gray-500">
                                        a partir de R${veiculo.preco.toLocaleString("pt-BR")}
                                    </p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}