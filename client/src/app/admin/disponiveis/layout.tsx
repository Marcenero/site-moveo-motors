import type { Metadata } from "next";

import { exigirAdminNaPagina } from "../../../lib/auth/admin";

export const metadata: Metadata = {
    title: "Veículos disponíveis",
};

export default async function DisponiveisLayout({ children }: { children: React.ReactNode }) {
    await exigirAdminNaPagina();

    return children;
}