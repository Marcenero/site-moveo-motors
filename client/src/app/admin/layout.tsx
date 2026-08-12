import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Painel administrativo",
        template: "%s | Admin Moveo Motors",
    },

    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}