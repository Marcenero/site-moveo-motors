import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import LogoutButton from "../../components/admin/logout-button";
import { veiculos } from "../../data/veiculos";
import { Car, TrendingUp } from "lucide-react";

const vendasUltimosDias = [
    { dia: "Seg", vendidos: 1 },
    { dia: "Ter", vendidos: 0 },
    { dia: "Qua", vendidos: 2 },
    { dia: "Qui", vendidos: 1 },
    { dia: "Sex", vendidos: 3 },
];

export default async function AdminPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    const quantidade_disponiveis = veiculos.length;

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

                <div className="grid gap-6 grd-cols-1">
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
                                    {quantidade_disponiveis}
                                </strong>
                            </div>

                            <div className="rounded-full bg-gray-100 p-4">
                                <Car className="text-gray-800" size={28} />
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Clique para ver, editar ou marcar veículos como vendidos
                        </p>
                    </Link>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
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
                </div>
            </section>
        </main>
    );
}

function GraficoVendas({
    dados,
}: {
    dados: { dia: string; vendidos: number }[];
}) {
    const largura = 600;
    const altura = 220;
    const padding = 32;

    const maiorValor = Math.max(...dados.map((item) => item.vendidos), 1);

    const pontos = dados.map((item, index) => {
        const x =
            padding +
            (index * (largura - padding * 2)) / Math.max(dados.length - 1, 1);

        const y =
            altura -
            padding -
            (item.vendidos / maiorValor) * (altura - padding * 2);

        return {...item, x, y};
    });

    const linha = pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ");

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${largura} ${altura}`}
                className="h-64 w-[90%]"
                role="img"
                aria-label="Gráfico de veículos vendidos nos últimos 5 dias"
            >
                <polyline 
                    points={linha}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-green-300"
                />

                {pontos.map((ponto) => (
                    <g key={ponto.dia}>
                        <circle 
                            cx={ponto.x}
                            cy={ponto.y}
                            r="6"
                            className="fill-white stroke-green-300"
                            strokeWidth="3"
                        />

                        <text
                            x={ponto.x}
                            y={ponto.y - 14}
                            textAnchor="middle"
                            className="fill-gray-900 text-xs font-bold"
                        >
                            {ponto.vendidos}
                        </text>

                        <text
                            x={ponto.x}
                            y={altura - 8}
                            textAnchor="middle"
                            className="fill-gray-500 text-xs"
                        >
                            {ponto.dia}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    )
}