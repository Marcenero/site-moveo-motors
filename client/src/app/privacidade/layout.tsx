import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade",

    description: "Consulte a Política de Privacidade da Moveo Motors e saiba como seus dados pessoais podem ser coletados, utilizados, protegidos e compartilhados.",
};

export default function PrivacidadeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}