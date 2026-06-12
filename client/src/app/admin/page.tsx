import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import LogoutButton from "../../components/admin/logout-button";
import GraficoVendas from "../../components/admin/grafico-vendas";
import { Car, TrendingUp, Plus } from "lucide-react";

function gerarUltimos5Dias(
    veiculos: { vendido: boolean; data_venda: string | null }[]
) {
    const hoje = new Date();

    return Array.from({ length: 5 }, (_, index) => {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - (4 - index));

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        const dataFormatada = `${ano}-${mes}-${dia}`;

        const vendidos = veiculos.filter(
            (veiculo) =>
                veiculo.vendido === true &&
                veiculo.data_venda?.split("T")[0] === dataFormatada
        ).length;

        return {
            dia: `${data.getDate()}/${data.getMonth() + 1}`,
            vendidos,
        };
    });
}

export default async function AdminPage() {
    const supabase = await createClient();

    let quantidade_disponiveis: number | string = "-";
    let erroQuantidade = "";
    let listaVeiculos: { vendido: boolean; data_venda: string | null }[] = [];

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    try {
        const response = await fetch("http://localhost:3001/veiculos", {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar veículos no banco de dados.");
        }

        const resultado = await response.json();

        const listaVeiculos = resultado.veiculos ?? [];

        quantidade_disponiveis = listaVeiculos.length;
    }
    catch (error) {
        console.error("Erro ao carregar quantidade de veículos:", error);

        erroQuantidade = "Erro";
    }

    const vendasUltimosDias = gerarUltimos5Dias(listaVeiculos);

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