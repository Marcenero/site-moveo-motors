"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

async function uploadImagensNoBackend(arquivos: File[]) {
    const formData = new FormData();

    arquivos.forEach((arquivo) => {
        formData.append("imagens", arquivo);
    });

    const resposta = await fetch("http://localhost:3001/veiculos/upload-imagens", {
        method: "POST",
        body: formData,
    });

    if (!resposta.ok) {
        throw new Error("Erro ao enviar imagens.");
    }

    const dados = await resposta.json();

    return dados.urls as string[];
}

export default function CadastrarVeiculoPage() {
    const router = useRouter();

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [arquivos, setArquivos] = useState<File[]>([]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            const formData = new FormData(e.currentTarget);

            let imagens: string[] = [];

            if (arquivos.length > 0) {
                imagens = await uploadImagensNoBackend(arquivos);
            }

            const payload = {
                nome: formData.get("nome"),
                km: formData.get("km"),
                cor: formData.get("cor"),
                final_placa: formData.get("final_placa"),
                estado_IPVA: formData.get("estado_IPVA") === "on",
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
                imagens,
            };

            const resposta = await fetch("http://localhost:3001/veiculos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!resposta.ok) {
                setErro("Erro ao cadastrar veículo.");
                return;
            }

            router.push("/admin/disponiveis");
        }
        catch (error) {
            console.error(error);
            setErro("Erro ao cadastrar veículo. Verifique os dados e tente novamente.");
        }
        finally {
            setCarregando(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    Cadastrar veículo
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-black">
                            Dados principais
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Nome
                                <input name="nome" placeholder="Nome" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Ano
                                <input name="ano" type="number" placeholder="Ano" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Preço
                                <input name="preco" type="number" placeholder="Preço" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Quilometragem
                                <input name="km" type="number" placeholder="Km" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Cor
                                <input name="cor" placeholder="Cor" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Final da placa
                                <input name="final_placa" type="number" placeholder="Final da placa" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Câmbio
                                <input name="cambio" placeholder="Câmbio" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Motor
                                <input name="motor" placeholder="Motor" required className="rounded-lg border p-3" />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Combustível
                                <input name="combustivel" placeholder="Combustível" required className="rounded-lg border p-3" />
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
                                    placeholder="Descrição"
                                    required
                                    className="min-h-28 rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                Outras informações
                                <textarea 
                                    name="outras_infos"
                                    placeholder="Outras informações (uma por linha)"
                                    className="min-h-24 rounded-lg border p-3"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Imagens
                        </h2>

                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
                            <label className="grid gap-2 text-sm font-medium text-gray-700">
                                Imagens do veículo
                                <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const novosArquivos = Array.from(event.target.files ?? []);

                                        setArquivos((arquivosAtuais) => [
                                            ...arquivosAtuais,
                                            ...novosArquivos,
                                        ]);

                                        event.target.value = "";
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white p-3 font-normal"
                                />
                            </label>

                            <p className="mt-2 text-xs text-gray-500">
                                Selecione uma imagem por vez. Elas serão acumuladas na lista abaixo.
                            </p>

                            {arquivos.length > 0 && (
                                <div className="mt-3 grid gap-2">
                                    <p className="text-sm text-gray-500">
                                        {arquivos.length} imagem(ns) selecionada(s)
                                    </p>

                                    <ul className="grid gap-2">
                                        {arquivos.map((arquivo, index) => (
                                            <li
                                                key={`${arquivo.name}-${index}`}
                                                className="flex items-center justify-between rounded-lg bg-white p-3 text-sm text-gray-600"
                                            >   
                                                <span className="truncate">{arquivo.name}</span>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setArquivos((arquivosAtuais) =>
                                                            arquivosAtuais.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                    className="text-red-600 hover: text-red-800"
                                                >
                                                    Remover
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input 
                                name="estado_IPVA" 
                                type="checkbox"
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

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={carregando}
                            onClick={() => router.push("/admin")}
                            className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="rounded-lg border border-green-300 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-60"
                        >
                            {carregando ?"Cadastrando..." : "Cadastrar veículo"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}