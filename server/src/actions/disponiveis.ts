import { createClient } from "../../../supabase/server";

export async function marcarVendido(id: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("Veiculo")
        .update({
            vendido: true,
            data_venda: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        throw new Error("Erro ao marcar veículo como vendido.");
    }

    return { success: true };
}