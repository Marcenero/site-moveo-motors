import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sobre Nós",

    description: "Conheça a Moveo Motors em Osasco, nossa históriae o compromisso com qualidade, procedência, transparência e atendimento na compra do seu carro.",

    alternates: {
        canonical: "/sobre",
    },
};

export default function ServicosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}