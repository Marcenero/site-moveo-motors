import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import type { Veiculo } from "../../types/veiculo";

type VehicleCardProps = {
    veiculo: Veiculo;
};

export default function VehicleCard({ veiculo }: VehicleCardProps) {
    return (
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <img
                src={veiculo.imagem}
                alt={veiculo.nome}
                className="w-full h-70 object-cover"
            />

            <div className="p-5 space-y-3">
                <h3 className="text-xl font-semibold text-black">{veiculo.nome}</h3>

                <p className="text-2xl font-bold text-[#D9A300]">
                    R$ {veiculo.preco.toLocaleString("pt-BR")}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                    <span><strong>{veiculo.ano}</strong></span>
                    <span>&#9702;</span>
                    <span><strong>{veiculo.km.toLocaleString("pt-BR")} km</strong></span>
                    <span>&#9702;</span>
                    <span><strong>{veiculo.combustivel}</strong></span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Link
                        href={`/estoque/${veiculo.id}`}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111111] text-[#D9A300] transition hover:bg-[#D9A300] hover:text-black"
                        aria-label={`Ver detalhes de ${veiculo.nome}`}
                    >
                        <ChevronsRight size={20} />
                    </Link>

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