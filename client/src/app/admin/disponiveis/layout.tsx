import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Veículos disponíveis",
};

export default function DisponiveisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}