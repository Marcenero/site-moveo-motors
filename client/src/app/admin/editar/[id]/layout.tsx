import type { Metadata } from "next";

import { exigirAdminNaPagina } from "../../../../lib/auth/admin";

export const metadata: Metadata = {
    title: "Editar veículo",
};

export default async function EditarVeiculoLayout({ children }: { children: React.ReactNode }) {
    await exigirAdminNaPagina();

    return children;
}