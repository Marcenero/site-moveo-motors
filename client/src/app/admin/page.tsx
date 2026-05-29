import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import LogoutButton from "../../components/admin/logout-button";

export default async function AdminPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Painel administrativo
                        </h1>

                        <p className="text-sm text-gray-500">
                            Logado como {user.email}
                        </p>
                    </div>

                    <LogoutButton />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Veículos cadastrados
                        </p>

                        <strong className="text-3xl text-gray-900">
                            0
                        </strong>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Disponíveis
                        </p>

                        <strong className="text-3xl text-gray-900">
                            0
                        </strong>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Vendidos
                        </p>

                        <strong className="text-3xl text-gray-900">
                            Implementar depois
                        </strong>
                    </div>
                </div>
            </section>
        </main>
    );
}