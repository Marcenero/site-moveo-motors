import type { MetadataRoute } from "next";
import type { Veiculo } from "../types/veiculo";

import { logError } from "../lib/logger";

import { getApiUrl, getSiteUrl } from "../lib/env.server";

function gerarSlug(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const apiUrl = getApiUrl();

    let veiculos: Veiculo[] = [];

    try {
        const resposta = await fetch(
           `${apiUrl}/veiculos`
        );

        if (!resposta.ok) {
            throw new Error(
                `Falha ao buscar veículos para o sitemap: HTTP ${resposta.status}`
            )
        }

        const dados: unknown = await resposta.json();

        if (Array.isArray(dados)) {
            veiculos = dados;
        }
        else if (
            dados &&
            typeof dados === "object" &&
            "veiculos" in dados &&
            Array.isArray(dados.veiculos)
        ) {
            veiculos = dados.veiculos;
        }
    }
    catch (error) {
        logError(
            "sitemap_generation_failed",
            error,
            {
                component: "seo",
                operation: "gerar_sitemap",
            }
        );
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