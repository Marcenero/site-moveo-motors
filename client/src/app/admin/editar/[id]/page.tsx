"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Veiculo } from "../../../../types/veiculo";

export default function EditarVeiculoPage() {
    const router = useRouter();
    const params = useParams();
    
    const id = params.id;

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarVeiculo() {
            try {
                const resposta = await fetch(`http://localhost:3001/veiculos/${id}`);

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar veículo.");
                }

                const dados = await resposta.json();

                setVeiculo(dados.veiculo);
            }
            catch (error) {
                console.error("Erro ao buscar veículo:", error);
            }
            finally {
                setCarregando(false);
            }
        }

        if (id) {
            buscarVeiculo();
        }
    }, [id]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const confirmou = window.confirm(
            "Tem certeza que deseja salvar as alterações?"
        );

        if (!confirmou) {
            return;
        }

        setErro("");
        setSalvando(true);

        try {
            const formData = new FormData(e.currentTarget);

            const payload = {
                nome: formData.get("nome"),
                km: formData.get("km"),
                cor: formData.get("cor"),
                final_placa: formData.get("final_placa"),
                estado_ipva: formData.get("estado_ipva") === "on",
                preco: formData.get("preco"),
                ano: formData.get("ano"),
                cambio: formData.get("cambio"),
                motor: formData.get("motor"),
                combustivel: formData.get("combustivel"),
                descricao: formData.get("descricao"),
                outras_infos: String(formData.get("outras_infos") || "")
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
            };

            const resposta = await fetch(`http://localhost:3001/veiculos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!resposta.ok) {
                /*const erroBackend = await resposta.json().catch(() => null);

                throw new Error(
                    erroBackend?.erro || "Erro ao editar veículo."
                );*/

                const textoErro = await resposta.text();

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
                    `Erro ${resposta.status} - ${resposta.statusText}: ${erroBackend || "Sem detalhes do backend."}`
                );
            }

            router.push("/admin/disponiveis");
        }
        catch (error) {
            /*console.error("Erro ao salvar alterações:", error);
            setErro("Não foi possível salvar as alterações.");*/

            console.error("Erro ao salvar alterações:", error);

            const mensagem =
                error instanceof Error
                    ? error.message
                    : "Erro desconhecido ao salvar alterações.";

            setErro(mensagem);
        }
        finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <main className="min-h-screen bg-[#f7f7f7] p-6">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Carregando dados do veículo...
                    </p>
                </section>
            </main>
        );
    }

    if (!veiculo) {
        return (
            <main className="min-h-screen bg-[#f7f7f7] p-6">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-red-600">
                        Veículo não encontrado.
                    </p>
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

                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    Editar veículo
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-black">
                            Dados principais
                        </h2>

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
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Descrição
                        </h2>

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
                                <p className="text-sm font-semibold text-gray-900">
                                    IPVA pago
                                </p>

                                <p className="text-xs text-gray-500">
                                    Marque esta opção caso o veículo esteja com o IPVA em dia.
                                </p>
                            </div>
                        </label>
                    </div>

                    {erro && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {erro}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm: justify-end">
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
                            {salvando ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}