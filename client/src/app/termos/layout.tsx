import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos & Condições",

    description: "Consulte os Termos e Condições da Moveo Motors para uso do site, informações sobre veículos, preços, financiamento, serviços e atendimento.",
};

export default function ServicosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}