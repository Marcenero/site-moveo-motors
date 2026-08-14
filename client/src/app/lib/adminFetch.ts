import { createClient } from "../../../../supabase/client";

const supabase = createClient();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function adminFetch(
    caminho: string,
    options: RequestInit = {}
) {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL não está configurada.");
    }

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error || !session) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    const headers = new Headers(options.headers);

    headers.set(
        "Authorization",
        `Bearer ${session.access_token}`
    );

    return fetch(`${API_URL}${caminho}`, {
        ...options,
        headers,
    });
}