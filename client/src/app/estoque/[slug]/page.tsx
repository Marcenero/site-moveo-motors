import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VehicleDetailsClient from "../../../components/estoque/VehicleDetailsClient";
import type { Veiculo } from "../../../types/veiculo";

type Props = {
    params: Promise<{ slug: string }>;
}

async function buscarVeiculoPorId(id: number): Promise<Veiculo | null> {
    const resposta = await fetch(`${process.env.API_URL ?? "http://localhost:3001"}/veiculos/${id}`, {
        cache: "no-store",
    });

    if (resposta.status === 404) {
        return null;
    }

    if (!resposta.ok) {
        throw new Error("Erro ao buscar veículo.");
    }

    const dados = await resposta.json();

    return dados.veiculo ?? null;
}

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug } = await params;

    const id = Number(slug.split("-").pop());

    if (Number.isNaN(id)) {
        return {
            title: "Veículo não encontrado",
        };
    }

    const veiculo = await buscarVeiculoPorId(id);

    if (!veiculo) {
        return {
            title: "Veículo não encontrado",
        };
    }

    const ano = String(veiculo.ano);

    const nomeComAno = veiculo.nome.includes(ano)
        ? veiculo.nome
        : `${veiculo.nome} ${ano}`;

    const detalhes = [
        `${veiculo.km.toLocaleString("pt-BR")} km`,
        veiculo.cambio,
        veiculo.motor,
        veiculo.combustivel,
    ]
        .filter(Boolean)
        .join(" - ");

    const descricao =
        `${nomeComAno} com ${detalhes}` +
        "Confira fotos, ficha técnica e condições na Moveo Motors em Osasco, SP.";

    const siteUrl=
        process.env.NEXT_PUBLIC_SITE_URL ??
        "https://moveomotors.com.br";

    const imagemPrincipalUrl = veiculo.imagens?.[0]?.url;

    const imagemPrincipal = imagemPrincipalUrl
        ? imagemPrincipalUrl.startsWith("http")
            ? imagemPrincipalUrl
            : new URL(imagemPrincipalUrl, siteUrl). toString()
        : new URL("/og.png", siteUrl).toString();

    return {
        title: nomeComAno,

        description:
            `${nomeComAno} com ${detalhes}. ` +
            "Confira fotos, ficha técnica e condições na Moveo Motors em Osasco, SP.",

        openGraph: {
            title: `${nomeComAno} | Moveo Motors`,
            description: descricao,
            url: `/estoque/${slug}`,
            siteName: "Moveo Motors",
            locale: "pt_BR",
            type: "website",

            images: [
                {
                    url: imagemPrincipalUrl,
                    alt: `${nomeComAno} à venda na Moveo Motors`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: `${nomeComAno} | Moveo Motors`,
            description: descricao,
            images: [imagemPrincipal],
        },
    };
}

export default async function VehicleDetailsPage({
    params,
}: Props) {
    const { slug } = await params;

    const id = Number(slug.split("-").pop());

    if (Number.isNaN(id)) {
        notFound();
    }

    const veiculo = await buscarVeiculoPorId(id);

    if (!veiculo) {
        notFound();
    }

    return <VehicleDetailsClient veiculo={veiculo} />;
}