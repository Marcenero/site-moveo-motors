import type { Veiculo } from "../../types/veiculo";
import VehicleCard from "./VehicleCard";

type VehicleGridProps = {
    veiculos: Veiculo[];
}

export default function VehicleGrid({ veiculos }: VehicleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-[97%] flex-col mx-auto gap-6 pt-24">
            {veiculos.map((veiculo) => (
                <VehicleCard key={veiculo.id} veiculo={veiculo} />
            ))}
        </div>
    );
}