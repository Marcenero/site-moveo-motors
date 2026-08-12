import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Carros Seminovos em Osasco",
        template: "%s | Moveo Motors",
    },

    description: "Confira o estoque de carros seminovos da Moveo Motors em Osasco. Encontre veículos selecionados com procedência e fale com nossa equipe.",
};

export default function EstoqueLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}