import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import LogoutButton from "../../components/admin/logout-button";
import GraficoVendas from "../../components/admin/grafico-vendas";
import { Car, TrendingUp, Plus } from "lucide-react";

type VendaGrafico = {
    dia: string;
    vendidos: number;
}

const API_URL =
    process.env.API_URL ??
    "http://localhost:3001";

export default async function AdminPage() {
    const supabase = await createClient();

    let quantidade_disponiveis: number | string = "-";
    let erroQuantidade = "";
    let vendasUltimosDias: VendaGrafico[] = [];

    const {
        data: { user },
        error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
        redirect("/admin/login");
    }

    const {
        data: { session },
        error: erroSessao,
    } = await supabase.auth.getSession();

    if (erroSessao || !session?.access_token) {
        redirect("/admin/login");
    }

    const accessToken = session.access_token;

    try {
        const response = await fetch(`${API_URL}/veiculos`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar veículos no banco de dados.");
        }

        const resultado = await response.json();

        const listaVeiculos = 
            Array.isArray(resultado.veiculos)
                ? resultado.veiculos
                : [];

        quantidade_disponiveis = listaVeiculos.length;
    }
    catch (error) {
        console.error("Erro ao carregar quantidade de veículos:", error);

        erroQuantidade = "Erro";
    }

    try {
        const response = await fetch(`${API_URL}/veiculos/vendas/ultimos-5-dias`, {
            cache: "no-store",

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 401) {
            redirect(
                "/admin/login?error=session"
            );
        }

        if (response.status === 403) {
            redirect(
                "/admin/login?error=forbidden"
            );
        }

        if (!response.ok) {
            const dadosErro =
                await response
                    .json()
                    .catch(() => null);

            console.error(
                "Erro da API ao buscar vendas:",
                dadosErro
            );

            throw new Error(
                "Erro ao buscar vendas nos últimos 5 dias."
            );
        }

        const resultado = await response.json();

        vendasUltimosDias = Array.isArray(resultado.vendas)
            ? resultado.vendas
            : [];
    }
    catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);

        vendasUltimosDias = [
            { dia: "Hoje -4", vendidos: 0 },
            { dia: "Hoje -3", vendidos: 0 },
            { dia: "Hoje -2", vendidos: 0 },
            { dia: "Ontem", vendidos: 0 },
            { dia: "Hoje", vendidos: 0 },
        ];
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

                <div className="grid gap-6 md:grid-cols-2">
                    <Link 
                        href="/admin/disponiveis"
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:bg-gray-200"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Disponíveis
                                </p>

                                <strong className="text-3xl text-gray-900">
                                    {erroQuantidade || quantidade_disponiveis}
                                </strong>
                            </div>

                            <div className="rounded-full bg-gray-100 p-4">
                                <Car className="text-gray-800" size={26} />
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Clique para ver, editar ou marcar veículos como vendidos
                        </p>
                    </Link>

                    <Link
                        href="/admin/cadastro"
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:bg-gray-200"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <strong className="font-bold text-black text-2xl">
                                Cadastrar veículo
                            </strong>

                            <div className="rounded-full bg-gray-100 p-4">
                                <Plus className="text-gray-800" size={26} />
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Clique para cadastrar um novo veículo no estoque
                        </p>
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 mt-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Vendas nos últimos 5 dias
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Veículos vendidos por dia
                            </h2>
                        </div>

                        <div className="rounded-full bg-gray-100 p-3">
                            <TrendingUp className="text-gray-800" size={28} />
                        </div>
                    </div>

                    <GraficoVendas dados={vendasUltimosDias} />
                </div>
            </section>
        </main>
    );
}