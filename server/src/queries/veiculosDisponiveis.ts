import { createClient } from "../../../supabase/server.js";
import type { Veiculo } from "../../../client/src/types/veiculo.js";

export async function buscarVeiculosDisponiveis(): Promise<Veiculo[]> {
    const supabase = await createClient();

    const { data: veiculos, error } = await supabase
        .from("Veiculo")
        .select("*")
        .eq("vendido", false);

    if (error) {
        console.error("Erro ao buscar veículos disponíveis:", error);
        return [];
    }

    return (veiculos ?? []) as Veiculo[];
}