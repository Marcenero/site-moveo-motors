export function getPublicApiUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (apiUrl) {
        return apiUrl.replace(/\/+$/, "");
    }

    if (process.env.NODE_ENV !== "production") {
        return "http://localhost:3001";
    }

    throw new Error("NEXT_PUBLIC_API_URL não está configurada em produção");
}