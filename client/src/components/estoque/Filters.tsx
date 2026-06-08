"use client";

import { useId } from "react";
import type { Veiculo } from "../../types/veiculo";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
    busca: string;
    marca: string;
    precoMax: number;
    anoMin: number;
    anoMax: number;
    kmMax: number;
    cambio: string[];
    combustivel: string[];
    ipvaPago: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ANO_MIN_GLOBAL = 2000;
const ANO_MAX_GLOBAL = new Date().getFullYear() + 1;
const PRECO_MAX_GLOBAL = 500_000;
const KM_MAX_GLOBAL = 300_000;

export const FILTROS_INICIAIS: FilterState = {
    busca: "",
    marca: "",
    precoMax: PRECO_MAX_GLOBAL,
    anoMin: ANO_MIN_GLOBAL,
    anoMax: ANO_MAX_GLOBAL,
    kmMax: KM_MAX_GLOBAL,
    cambio: [],
    combustivel: [],
    ipvaPago: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Since Veiculo has no "marca" field, we extract it from the first word of "nome"
export function extrairMarca(nome: string): string {
    return nome.trim().split(/\s+/)[0];
}

export function filtrar(veiculos: Veiculo[], f: FilterState): Veiculo[] {
    return veiculos.filter((v) => {
        const marca = extrairMarca(v.nome);

        if (f.busca) {
            const q = f.busca.toLowerCase();
            if (!v.nome.toLowerCase().includes(q)) return false;
        }

        if (f.marca && marca !== f.marca) return false;
        if (v.preco > f.precoMax) return false;
        if (v.ano < f.anoMin || v.ano > f.anoMax) return false;
        if (v.km > f.kmMax) return false;
        if (f.cambio.length > 0 && !f.cambio.includes(v.cambio)) return false;
        if (f.combustivel.length > 0 && !f.combustivel.includes(v.combustivel)) return false;
        if (f.ipvaPago && !v.estado_IPVA) return false;       // ← correct field

        return true;
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FiltersProps {
    veiculos: Veiculo[];
    valor: FilterState;
    aoMudar: (f: FilterState) => void;
}

export default function Filters({ veiculos, valor, aoMudar }: FiltersProps) {
    const uid = useId();

    const marcas = Array.from(
        new Set(veiculos.map((v) => extrairMarca(v.nome)))
    ).sort();

    const cambioOpcoes = Array.from(
        new Set(veiculos.map((v) => v.cambio).filter(Boolean))
    ).sort();

    const combustivelOpcoes = Array.from(
        new Set(veiculos.map((v) => v.combustivel).filter(Boolean))
    ).sort();

    function set<K extends keyof FilterState>(key: K, val: FilterState[K]) {
        aoMudar({ ...valor, [key]: val });
    }

    function toggleArray(key: "cambio" | "combustivel", item: string) {
        const current = valor[key];
        const next = current.includes(item)
            ? current.filter((x) => x !== item)
            : [...current, item];
        set(key, next);
    }

    return (
        <aside className="space-y-6">
            {/* Search */}
            <div>
                <label htmlFor={`${uid}-busca`} className={labelCls}>Busca</label>
                <input
                    id={`${uid}-busca`}
                    type="search"
                    placeholder="Nome, marca…"
                    value={valor.busca}
                    onChange={(e) => set("busca", e.target.value)}
                    className={inputCls}
                />
            </div>

            {/* Brand */}
            <div>
                <label htmlFor={`${uid}-marca`} className={labelCls}>Marca</label>
                <select
                    id={`${uid}-marca`}
                    value={valor.marca}
                    onChange={(e) => set("marca", e.target.value)}
                    className={inputCls}
                >
                    <option value="">Todas</option>
                    {marcas.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {/* Price */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className={labelCls}>Preço máximo</span>
                    <span className="text-xs font-semibold text-gray-600">
                        {valor.precoMax >= PRECO_MAX_GLOBAL
                            ? "Qualquer"
                            : `R$ ${valor.precoMax.toLocaleString("pt-BR")}`}
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={PRECO_MAX_GLOBAL}
                    step={5_000}
                    value={valor.precoMax}
                    onChange={(e) => set("precoMax", Number(e.target.value))}
                    className={rangeCls}
                />
            </div>

            {/* Year */}
            <div>
                <span className={labelCls}>Ano</span>
                <div className="flex gap-2 mt-1">
                    <input
                        type="number"
                        min={ANO_MIN_GLOBAL}
                        max={valor.anoMax}
                        value={valor.anoMin}
                        onChange={(e) => set("anoMin", Number(e.target.value))}
                        className={`${inputCls} w-full`}
                        placeholder="De"
                    />
                    <input
                        type="number"
                        min={valor.anoMin}
                        max={ANO_MAX_GLOBAL}
                        value={valor.anoMax}
                        onChange={(e) => set("anoMax", Number(e.target.value))}
                        className={`${inputCls} w-full`}
                        placeholder="Até"
                    />
                </div>
            </div>

            {/* Mileage */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className={labelCls}>Km máximo</span>
                    <span className="text-xs font-semibold text-gray-600">
                        {valor.kmMax >= KM_MAX_GLOBAL
                            ? "Qualquer"
                            : `${(valor.kmMax / 1_000).toFixed(0)}k km`}
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={KM_MAX_GLOBAL}
                    step={5_000}
                    value={valor.kmMax}
                    onChange={(e) => set("kmMax", Number(e.target.value))}
                    className={rangeCls}
                />
            </div>

            {/* Transmission */}
            {cambioOpcoes.length > 0 && (
                <div>
                    <span className={labelCls}>Câmbio</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {cambioOpcoes.map((op) => (
                            <Chip
                                key={op}
                                label={op}
                                ativo={valor.cambio.includes(op)}
                                onClick={() => toggleArray("cambio", op)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Fuel */}
            {combustivelOpcoes.length > 0 && (
                <div>
                    <span className={labelCls}>Combustível</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {combustivelOpcoes.map((op) => (
                            <Chip
                                key={op}
                                label={op}
                                ativo={valor.combustivel.includes(op)}
                                onClick={() => toggleArray("combustivel", op)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Toggles */}
            <div className="space-y-3">
                <Toggle
                    id={`${uid}-ipva`}
                    label="IPVA pago"
                    checked={valor.ipvaPago}
                    onChange={(v) => set("ipvaPago", v)}
                />
            </div>

            {/* Reset */}
            <button
                onClick={() => aoMudar(FILTROS_INICIAIS)}
                className="w-full h-10 rounded-xl border border-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white hover:border-black transition-colors"
            >
                Limpar filtros
            </button>
        </aside>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chip({ label, ativo, onClick }: { label: string; ativo: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${ativo
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:border-black"
                }`}
        >
            {label}
        </button>
    );
}

function Toggle({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label htmlFor={id} className="flex items-center justify-between cursor-pointer select-none">
            <span className="text-sm font-semibold">{label}</span>
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#D9A300]" : "bg-gray-200"}`} />
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
            </div>
        </label>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1";
const inputCls = "w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D9A300]";
const rangeCls = "w-full accent-[#D9A300]";