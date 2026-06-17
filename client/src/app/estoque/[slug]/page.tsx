import { notFound } from "next/navigation";
import VehicleDetailsClient from "../../../components/estoque/VehicleDetailsClient";
import type { Veiculo } from "../../../types/veiculo";

async function buscarVeiculoPorId(id: number): Promise<Veiculo | null> {
    const resposta = await fetch(`http://localhost:3001/veiculos/${id}`, {
        cache: "no-store",
    });

    if (resposta.status === 404) {
        return null;
    }

    if (!resposta.ok) {
        throw new Error("Erro ao buscar veículo.");
    }

    const dados = await resposta.json();

    return dados.veiculo ?? null;
}

export default async function VehicleDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const id = Number(slug.split("-").pop());

    if (Number.isNaN(id)) {
        notFound();
    }

    const veiculo = await buscarVeiculoPorId(id);

    if (!veiculo) {
        notFound();
    }

    return <VehicleDetailsClient veiculo={veiculo} />;
}