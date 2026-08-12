import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#111111] text-white px-6 py-10 flex items-center">
            <div className="max-w-4xl w-full mx-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D9A300] mb-3">
                    404 . not found
                </p>

                <h1 className="text-2xl md:text-4xl font-black mb-16">
                    Quando a rota some.
                </h1>

                <div className="mb-8">
                    <strong className="block text-[8rem] md:text-[12rem] leading-none font-black text-[#D9A300] tracking-tighter">
                        404
                    </strong>

                    <h2 className="text-3xl md:text-5xl font-black leading-tight max-w-2xl mt-4">
                        Essa rua não existe no nosso mapa.
                    </h2>

                    <p className="text-gray-400 mt-4 max-w-xl text-sm md:text-base leading-relaxed">
                        A página que você procurou não está mais aqui - talvez o veículo já tenha sido vendido, ou o link veio com um erro.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/"
                        className="h-11 px-5 rounded-xl bg-[#D9A300] text-black font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-white transition"
                    >
                        <ChevronLeft size={16} strokeWidth={2.5} /> 
                        Voltar
                    </Link>

                    <Link
                        href="/estoque"
                        className="h-11 px-6 rounded-xl border border-white/30 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center hover:bg-white hover:text-black transition"
                    >
                        Ir para o estoque
                    </Link>
                </div>

                <div className="hidden mt-14 border-t border-white/10 pt-6">
                    <code className="text-xs text-gray-500">
                        <span className="text-[#D9A300]">$</span>{" "}
                        grep -r &quot;params.id&quot; estoque 
                        <span className="text-gray-600">  → no match</span>
                    </code>
                </div>
            </div>
        </main>
    )
}