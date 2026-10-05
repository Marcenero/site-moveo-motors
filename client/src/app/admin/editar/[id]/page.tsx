"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Veiculo } from "../../../../types/veiculo";

import { adminFetch } from "../../../../lib/adminFetch";
import { logError } from "../../../../lib/logger";
import { getPublicApiUrl } from "../../../../lib/env.client";

type DadosVeiculoFormulario = {
    nome: string;
    km: string;
    cor: string;
    final_placa: string;
    estado_ipva: boolean;
    preco: string;
    ano: string;
    cambio: string;
    motor: string;
    combustivel: string;
    descricao: string;
    outras_infos: string[];
};

function ItemRevisao({
    titulo,
    valor,
}: {
    titulo: string;
    valor: string;
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                {titulo}
            </p>

            <p className="font-medium text-gray-900">
                {valor || "-"}
            </p>
        </div>
    );
}

function formatarPreco(valor: string) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return valor;
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numero);
}

function formatarKm(valor: string) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return valor;
    }

    return `${new Intl.NumberFormat("pt-BR").format(numero)} km`;
}

export default function EditarVeiculoPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id;

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [dadosRevisao, setDadosRevisao] = useState<DadosVeiculoFormulario | null>(null);

    useEffect(() => {
        async function buscarVeiculo() {
            try {
                const apiUrl = getPublicApiUrl();

                const resposta = await fetch(`${apiUrl}/veiculos/${id}`);

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar veículo.");
                }

                const dados = await resposta.json();

                setVeiculo(dados.veiculo);
            } catch (error) {
                logError("vehicle_fetch_failed", error, {
                    component: "admin",
                    operation: "buscar_veiculo_edicao",
                });
            } finally {
                setCarregando(false);
            }
        }

        if (id) {
            buscarVeiculo();
        }
    }, [id]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setErro("");

        const formData = new FormData(e.currentTarget);

        const dados: DadosVeiculoFormulario = {
            nome: String(formData.get("nome") ?? "").trim(),
            km: String(formData.get("km") ?? "").trim(),
            cor: String(formData.get("cor") ?? "").trim(),
            final_placa: String(formData.get("final_placa") ?? "").trim(),
            estado_ipva: formData.get("estado_ipva") === "on",
            preco: String(formData.get("preco") ?? "").trim(),
            ano: String(formData.get("ano") ?? "").trim(),
            cambio: String(formData.get("cambio") ?? "").trim(),
            motor: String(formData.get("motor") ?? "").trim(),
            combustivel: String(formData.get("combustivel") ?? "").trim(),
            descricao: String(formData.get("descricao") ?? "").trim(),
            outras_infos: String(formData.get("outras_infos") ?? "")
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        };

        setDadosRevisao(dados);
        setModalAberto(true);
    }

    async function confirmarEdicao() {
        if (!dadosRevisao) {
            return;
        }

        setErro("");
        setSalvando(true);

        try {
            const resposta = await adminFetch(
                `/veiculos/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dadosRevisao),
                }
            );

            if (resposta.status === 401) {
                setModalAberto(false);
                router.push("admin/login");

                return;
            }

            if (resposta.status === 403) {
                throw new Error(
                    "Você não possui permissão para editar veículos."
                );
            }

            if (!resposta.ok) {
                const textoErro = await resposta.text()

                let erroBackend = "";

                try {
                    const erroJson = JSON.parse(textoErro);

                    erroBackend =
                        erroJson.erro ||
                        erroJson.error ||
                        erroJson.message ||
                        JSON.stringify(erroJson, null, 2);
                } catch {
                    erroBackend = textoErro;
                }

                throw new Error(
                    `Erro ${resposta.status} - ${
                        resposta.statusText
                    }: ${
                        erroBackend ||
                        "Sem detalhes do backend."
                    }`
                );
            }

            setModalAberto(false);

            router.push("/admin/disponiveis");
        } catch (error) {
            logError("vehicle_update_failed", error, {
                component: "admin",
                operation: "salvar_alteracoes_veiculo",
            });

            const mensagem = error instanceof Error
                ? error.message
                : "Erro desconhecido ao salvar alterações.";

            setErro(mensagem);
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <main className="min-h-screen bg-[#f7f7f7] p-6">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Carregando dados do veículo...</p>
                </section>
            </main>
        );
    }

    if (!veiculo) {
        return (
            <main className="min-h-screen bg-[#f7f7f7] p-6">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-red-600">Veículo não encontrado.</p>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                <Link
                    href="/admin/disponiveis"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                >
                    <ArrowLeft size={22} />
                    Voltar para disponíveis
                </Link>

                <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar veículo</h1>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-black">Dados principais</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Nome
                                <input
                                    name="nome"
                                    defaultValue={veiculo.nome}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Ano
                                <input
                                    name="ano"
                                    type="number"
                                    defaultValue={veiculo.ano}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Preço
                                <input
                                    name="preco"
                                    type="number"
                                    defaultValue={veiculo.preco}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Quilometragem
                                <input
                                    name="km"
                                    type="number"
                                    defaultValue={veiculo.km}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Cor
                                <input
                                    name="cor"
                                    defaultValue={veiculo.cor}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Final da placa
                                <input
                                    name="final_placa"
                                    type="number"
                                    defaultValue={veiculo.final_placa}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Câmbio
                                <input
                                    name="cambio"
                                    defaultValue={veiculo.cambio}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Motor
                                <input
                                    name="motor"
                                    defaultValue={veiculo.motor}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Combustível
                                <input
                                    name="combustivel"
                                    defaultValue={veiculo.combustivel}
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Descrição</h2>

                        <div className="grid gap-4">
                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Descrição do veículo
                                <textarea
                                    name="descricao"
                                    defaultValue={veiculo.descricao ?? ""}
                                    required
                                    className="min-h-28 rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Outras informações
                                <textarea
                                    name="outras_infos"
                                    defaultValue={(veiculo.outras_infos ?? []).join("\n")}
                                    className="min-h-24 rounded-lg border p-3"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                name="estado_ipva"
                                type="checkbox"
                                defaultChecked={veiculo.estado_ipva}
                                className="h-5 w-5 accent-black"
                            />

                            <div>
                                <p className="text-sm font-semibold text-gray-900">IPVA pago</p>

                                <p className="text-xs text-gray-500">
                                    Marque esta opção caso o veículo esteja com o IPVA em dia.
                                </p>
                            </div>
                        </label>
                    </div>

                    {erro && !modalAberto && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{erro}</p>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            disabled={salvando}
                            onClick={() => router.push("/admin/disponiveis")}
                            className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="rounded-lg border border-green-300 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-60"
                        >
                            Revisar alterações
                        </button>
                    </div>
                </form>
            </section>

            {modalAberto && dadosRevisao && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-confirmacao-edicao"
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* Cabeçalho */}
                        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-5">
                            <h2
                                id="titulo-confirmacao-edicao"
                                className="text-xl font-bold text-gray-900"
                            >
                                Confirmar alterações
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Confira as informações antes de atualizar o veículo.
                            </p>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Dados principais */}
                            <section>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Dados principais
                                </h3>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <ItemRevisao 
                                        titulo="Nome"
                                        valor={dadosRevisao.nome}
                                    />

                                    <ItemRevisao 
                                        titulo="Preço"
                                        valor={formatarPreco(
                                            dadosRevisao.preco
                                        )}
                                    />

                                    <ItemRevisao 
                                        titulo="Ano"
                                        valor={dadosRevisao.ano}
                                    />

                                    <ItemRevisao 
                                        titulo="Quilometragem"
                                        valor={formatarKm(
                                            dadosRevisao.km
                                        )}
                                    />

                                    <ItemRevisao 
                                        titulo="Cor"
                                        valor={dadosRevisao.cor}
                                    />

                                    <ItemRevisao 
                                        titulo="Final da placa"
                                        valor={dadosRevisao.final_placa}
                                    />

                                    <ItemRevisao 
                                        titulo="Câmbio"
                                        valor={dadosRevisao.cambio}
                                    />

                                    <ItemRevisao 
                                        titulo="Motor"
                                        valor={dadosRevisao.motor}
                                    />

                                    <ItemRevisao 
                                        titulo="Combustível"
                                        valor={dadosRevisao.combustivel}
                                    />

                                    <ItemRevisao 
                                        titulo="IPVA"
                                        valor={
                                            dadosRevisao.estado_ipva
                                                ? "Pago"
                                                : "Não informado como pago"
                                        }
                                    />
                                </div>
                            </section>

                            {/* Descrição */}
                            <section className="border-t border-gray-200 pt-5">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Descrição
                                </h3>

                                <div className="rounded-xl bg-gray-50 p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                                        {dadosRevisao.descricao}
                                    </p>
                                </div>
                            </section>

                            {/* Outras infos */}
                            <section className="border-t border-gray-200 pt-5">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Outras informações
                                </h3>

                                {dadosRevisao.outras_infos.length > 0
                                    ? (
                                        <ul className="grid gap-2">
                                            {dadosRevisao.outras_infos.map(
                                                (item, index) => (
                                                    <li
                                                        key={`${item}-${index}`}
                                                        className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-700"
                                                    >
                                                        {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Nenhuma informação adicional.
                                        </p>
                                    )
                                }
                            </section>

                            {/* Erro */}
                            {erro && (
                                <p
                                    role="alert"
                                    className="rounded-xl bg-red-50 p-4 text-sm text-red-600"
                                >
                                    {erro}
                                </p>
                            )}
                        </div>

                        {/* Botões */}
                        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={salvando}
                                onClick={() => {
                                    setErro("");
                                    setModalAberto(false);
                                }}
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Voltar e editar
                            </button>

                            <button
                                type="button"
                                disabled={salvando}
                                onClick={confirmarEdicao}
                                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {salvando
                                    ? "Salvando..."
                                    : "Confirmar alterações"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
