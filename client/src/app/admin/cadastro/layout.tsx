import type { Metadata } from "next";

import { exigirAdminNaPagina } from "../../../lib/auth/admin";

export const metadata: Metadata = {
    title: "Cadastrar Veículo",
};

export default async function CadastroLayout({ children }: { children: React.ReactNode }) {
    await exigirAdminNaPagina();

    return children;
}