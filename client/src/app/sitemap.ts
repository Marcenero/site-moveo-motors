import type { MetadataRoute } from "next";
import type { Veiculo } from "../types/veiculo";

function gerarSlug(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    let veiculos: Veiculo[] = [];

    try {
        const resposta = await fetch(
            `${process.env.API_URL ?? "http://localhost:3001/veiculos"}`
        );

        const dados = await resposta.json();

        veiculos = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.veiculos)
                ? dados.veiculos
                : [];
    }
    catch (error) {
        console.error("Erro ao gerar sitemap:", error);
    }

    const paginasFixas: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/estoque`,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/servicos`,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/sobre`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${siteUrl}/privacidade`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${siteUrl}/termos`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    const paginasVeiculos: MetadataRoute.Sitemap = veiculos.map(
        (veiculo) => ({
            url: `${siteUrl}/estoque/${gerarSlug(veiculo.nome)}-${veiculo.id}`,

            images:
                veiculo.imagens
                    ?.map((imagem) => imagem.url)
                    .filter(Boolean) ?? [],

            changeFrequency: "daily",
            priority: 0.8,
        })
    );

    return [...paginasFixas, ...paginasVeiculos];
}