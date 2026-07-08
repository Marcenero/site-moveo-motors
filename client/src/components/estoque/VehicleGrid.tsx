import type { Veiculo } from "../../types/veiculo";
import VehicleCard from "./VehicleCard";

type VehicleGridProps = {
    veiculos: Veiculo[];
};

export default function VehicleGrid({ veiculos }: VehicleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto px-6 gap-6 pt-8 pb-16">
            {veiculos.map((veiculo) => (
                <VehicleCard key={veiculo.id} veiculo={veiculo} />
            ))}
        </div>
    );
}