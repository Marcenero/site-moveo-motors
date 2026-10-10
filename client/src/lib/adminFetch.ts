export async function adminFetch(caminho: string, options: RequestInit = {}): Promise<Response> {
    if (!caminho.startsWith("/") || caminho.startsWith("//") || caminho.includes("\\")) {
        throw new Error("Caminho da API inválido.");
    }

    return fetch(`/api/admin${caminho}`, {
        ...options,
        credentials: "same-origin",
        cache: "no-store",
        redirect: "manual",
    });
}