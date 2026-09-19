import { createClient } from "../../../supabase/client";

import { getPublicApiUrl } from "../lib/env.client";

const supabase = createClient();

const apiUrl = getPublicApiUrl();

export async function adminFetch(
    caminho: string,
    options: RequestInit = {}
) {
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

    return fetch(`${apiUrl}${caminho}`, {
        ...options,
        headers,
    });
}