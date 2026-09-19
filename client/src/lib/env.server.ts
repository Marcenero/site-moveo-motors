const isProduction = process.env.NODE_ENV === "production";

export function getApiUrl() {
    const apiUrl = process.env.API_URL?.trim();

    if (apiUrl) {
        return apiUrl.replace(/\/+$/, "");
    }

    if (!isProduction) {
        return "http://localhost:3001";
    }

    throw new Error("API_URL não está configurada em produção.");
}

export function getSiteUrl() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

    if (siteUrl) {
        return siteUrl.replace(/\/+$/, "");
    }

    if (!isProduction) {
        return "http://localhost:3000";
    }

    throw new Error("NEXT_PUBLIC_SITE_URL não está configurada em produção.");
}