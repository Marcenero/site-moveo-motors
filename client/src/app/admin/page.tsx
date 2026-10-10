import Link from "next/link";
import { redirect } from "next/navigation";
import { logError } from "../../lib/logger";
import { verificarAdmin } from "../../lib/auth/admin";
import { adminServerFetch } from "../../lib/auth/adminServerFetch";
import LogoutButton from "../../components/admin/logout-button";
import GraficoVendas from "../../components/admin/dashboard/grafico-vendas";
import { Car, TrendingUp, Plus, History } from "lucide-react";
import { getPublicApiUrl } from "../../lib/env.client";

type VendaGrafico = {
    dia: string;
    vendidos: number;
};

// Garante que o painel administrativo não seja pré-renderizado
export const dynamic = "force-dynamic";

const API_URL = getPublicApiUrl();

export default async function AdminPage() {
    const resultado = await verificarAdmin();

    if (!resultado.autorizado) {
        if (resultado.motivo === "forbidden") {
            redirect("/admin/login?error=forbidden");
        }

        redirect("/admin/login");
    }

    const user = resultado.usuario;

    let quantidade_disponiveis: number | string = "-";
    let erroQuantidade = "";

    let vendasUltimosDias: VendaGrafico[] = [];
    let erroVendas = false;

    try {
        const resultadoVendas = await adminServerFetch("/veiculos/vendas/ultimos-45-dias");

        if (!resultadoVendas.autorizado) {
            erroVendas = true;
        } else if (!resultadoVendas.response.ok) {
            erroVendas = true;
        } else {
            const dados = await resultadoVendas.response.json();

            vendasUltimosDias = Array.isArray(dados.vendas) ? dados.vendas : [];
        }
    } catch (error) {
        erroVendas = true;

        logError("sales_chart_load_failed", error, {
            component: "admin",
            operation: "carregar_grafico_vendas",
        });
    }

    try {
        const response = await fetch(`${API_URL}/veiculos`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar veículos no banco de dados.");
        }

        const resultado = await response.json();

        const listaVeiculos = Array.isArray(resultado.veiculos) ? resultado.veiculos : [];

        quantidade_disponiveis = listaVeiculos.length;
    } catch (error) {
        logError("vehicle_count_fetch_failed", error, {
            component: "admin",
            operation: "carregar_quantidade_veiculos",
        });

        erroQuantidade = "Erro";
    }

    const totalVendas = vendasUltimosDias.reduce((total, venda) => total + venda.vendidos, 0);

    const mediaVendas = vendasUltimosDias.length > 0 ? totalVendas / vendasUltimosDias.length : 0;

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Painel administrativo</h1>

                        <p className="text-sm text-gray-500">Logado como {user.email}</p>
                    </div>

                    <LogoutButton />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Link
                        href="/admin/disponiveis"
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:bg-gray-200"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Disponíveis</p>

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

                    <Link
                        href="/admin/auditoria"
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:bg-gray-200"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <strong className="text-2xl font-bold text-black">Auditoria</strong>

                            <div className="rounded-full bg-gray-100 p-4">
                                <History className="text-gray-800" size={26} />
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Consulte o histórico de ações realizadas no painel administrativo
                        </p>
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 mt-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <strong className="font-bold text-black text-2xl">
                                Vendas nos últimos 45 dias
                            </strong>

                            <div className="mt-1 flex items-baseline gap-3">
                                <h2 className="text-3xl font-bold text-gray-900">{totalVendas}</h2>

                                <span className="text-sm text-gray-500">veículos vendidos</span>
                            </div>

                            <p className="mt-1 text-sm text-gray-400">
                                Média de {mediaVendas.toFixed(1).replace(".", ",")} por dia
                            </p>
                        </div>

                        <div className="rounded-full bg-gray-100 p-3">
                            <TrendingUp className="text-gray-800" size={28} />
                        </div>
                    </div>

                    {erroVendas ? (
                        <p role="alert" className="text-sm text-red-600">
                            Não foi possível carregar o histórico de vendas.
                        </p>
                    ) : (
                        <GraficoVendas dados={vendasUltimosDias} />
                    )}
                </div>
            </section>
        </main>
    );
}
