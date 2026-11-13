import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase Auth não está configurado.");

    return createServerClient(url, key, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                } catch { /* Server Components não podem gravar cookies; proxy.ts os atualiza. */ }
            },
        },
    });
}
