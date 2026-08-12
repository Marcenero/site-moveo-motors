import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cadastrar Veículo",
};

export default function CadastroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}