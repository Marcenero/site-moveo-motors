import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import LogoutButton from "../../components/admin/logout-button";
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
                veiculo.vendido &&
                veiculo.data_venda?.split("T")[0] === dataFormatada
        ).length;

        return {
            dia: `${data.getDate()}/${data.getMonth() + 1}`,
            vendidos,
        };
    });
}

function GraficoVendas({
    dados,
}: {
    dados: { dia: string; vendidos: number }[];
}) {
    const largura = 600;
    const altura = 240;
    const paddingX = 42;
    const paddingY = 32;

    const maiorValor = Math.max(...dados.map((item) => item.vendidos), 1);

    const linhasY = Array.from({ length: maiorValor + 1 }).map((_, valor) => {
        const y = altura - paddingY - (valor / maiorValor) * (altura - paddingY * 2);

        return { valor, y };
    });

    const pontos = dados.map((item, index) => {
        const x = paddingX + (index * (largura - paddingX * 2)) / Math.max(dados.length - 1, 1);

        const y = altura - paddingY - (item.vendidos / maiorValor) * (altura - paddingY * 2);

        return { ...item, x, y};
    });

    const linha = pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ");

    const area = `${pontos[0].x},${altura - paddingY}` + pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ") + ` ${pontos[pontos.length - 1].x},${altura - paddingY}`

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${largura} ${altura}`}
                className="h-72 w-[90%]"
                role="img"
                aria-label="Gráfico de veículos vendidos nos últimos 5 dias"
            >
                <defs>
                    <linearGradient id="vendasGradient" x="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.35" />
                        <stop offset="110%" stopColor="#6ee7b7" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {linhasY.map((linhaY) => (
                    <g key={linhaY.valor}>
                        <line
                            x1={paddingX}
                            x2={largura - paddingX}
                            y1={linhaY.y}
                            y2={linhaY.y}
                            stroke="#e5e7eb"
                            strokeDasharray="4 4"
                        />

                        <text
                            x={paddingX - 12}
                            y={linhaY.y + 4}
                            textAnchor="end"
                            className="fill-gray-400 text-xs"
                        >
                            {linhaY.valor}
                        </text>
                    </g>
                ))}

                <polygon points={area} fill="url(#vendasGradient)" />

                <polyline 
                    points={linha}
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {pontos.map((ponto) => (
                    <g key={ponto.dia}>
                        <circle 
                            cx={ponto.x}
                            cy={ponto.y}
                            r="6"
                            fill="#ffffff"
                            stroke="#6ee7b7"
                            strokeWidth="3"
                        />

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

export default async function AdminPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    const { data: veiculos, error } = await supabase
        .from("Veiculo")
        .select("id, vendido, data_venda");

    if (error) {
        console.error("Erro ao buscar veículos:", error);
    }

    const listaVeiculos = veiculos ?? [];

    const quantidade_disponiveis = listaVeiculos.filter(
        (veiculo) => !veiculo.vendido
    ).length;

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
                                    {quantidade_disponiveis}
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
                        href="/admin/cadastrar"
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