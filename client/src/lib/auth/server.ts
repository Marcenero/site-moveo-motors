import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl || !cookieSecret) {
    throw new Error(
        "Variáveis de ambiente do Neon Auth não configuradas."
    );
}

export const auth = createNeonAuth({
    baseUrl,
    cookies: {
        secret: cookieSecret,
        sessionDataTtl: 300,
        sameSite: "lax",
    },
});