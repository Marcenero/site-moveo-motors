import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Serviços Automotivos em Osasco",

    description: "Conheça os serviços da Moveo Motors em Osasco: seminovos, consignação, avaliação do seu usado e opções de financiamento.",

    alternates: {
        canonical: "/servicos",
    },
};

export default function ServicosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}