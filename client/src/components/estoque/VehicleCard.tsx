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

                <p className="text-orange-500 font-bold text-2xl">
                    R$ {veiculo.preco.toLocaleString("pt-BR")}
                </p>

                <div className="flex gap-3 text-sm text-gray-700">
                    <span><strong>{veiculo.ano}</strong></span>
                    <span>&#9702;</span>
                    <span><strong>{veiculo.km.toLocaleString("pt-BR")} km</strong></span>
                    <span>&#9702;</span>
                    <span><strong>{veiculo.combustivel}</strong></span>
                </div>

                <button className="flex items-center justify-center gap-2 w-full bg-white border-2 border-orange-500 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all rounded-xl">
                    Mais detalhes
                    <ChevronsRight size={20} />
                </button>
            </div>
        </div>
    );
}