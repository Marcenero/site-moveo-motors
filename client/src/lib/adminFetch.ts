export async function adminFetch(caminho: string, options: RequestInit = {}) {
    if (!caminho.startsWith("/") || caminho.startsWith("//")) {
        throw new Error("Caminho da API inválido.");
    }

    const response = await fetch(`/api/admin${caminho}`, {
        ...options,
        credentials: "same-origin",
        cache: "no-store",
    });

    if (response.status === 401) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    if (response.status === 403) {
        throw new Error("Você não tem permissão para esta operação.");
    }

    return response;
}