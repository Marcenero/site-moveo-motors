"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastrarVeiculoPage() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setErro("");
        setCarregando(true);

        const formData = new FormData(e.currentTarget);

        const imagensTexto = String(formData.get("imagens") || "");

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
            imagens: imagensTexto
                .split("\n")
                .map((url) => url.trim())
                .filter(Boolean)
        };

        const resposta = await fetch("http://localhost:3001/veiculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        setCarregando(false);

        if (!resposta.ok) {
            setErro("Erro ao cadastrar veículo.");
            return;
        }

        router.push("/admin/disponiveis");
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    Cadastrar veículo
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input name="nome" placeholder="Nome" required className="rounded-lg border p-3" />
                    <input name="ano" type="number" placeholder="Ano" required className="rounded-lg border p-3" />
                    <input name="preco" type="number" placeholder="Preço" required className="rounded-lg border p-3" />
                    <input name="km" type="number" placeholder="Km" required className="rounded-lg border p-3" />
                    <input name="cor" placeholder="Cor" required className="rounded-lg border p-3" />
                    <input name="final_placa" type="number" placeholder="Final da placa" required className="rounded-lg border p-3" />
                    <input name="cambio" placeholder="Câmbio" required className="rounded-lg border p-3" />
                    <input name="motor" placeholder="Motor" required className="rounded-lg border p-3" />
                    <input name="combustivel" placeholder="Combustível" required className="rounded-lg border p-3" />

                    <textarea 
                        name="descricao"
                        placeholder="Descrição"
                        required
                        className="min-h-28 rounded-lg border p-3"
                    />

                    <textarea 
                        name="imagens"
                        placeholder={"URLs das imagens, uma por linha"}
                        className="min-h-24 rounded-lg border p-3"
                    />

                    <label className="flex items-center gap-2 text-sm">
                        <input name="estado_IPVA" type="checkbox" />
                        IPVA pago
                    </label>

                    {erro && <p className="text-sm text-red-600"></p>}

                    <button
                        type="submit"
                        disabled={carregando}
                        className="rounded-lg bg-black p-3 font-bold text-white disabled:opacity-60"
                    >
                        {carregando ?"Cadastrando..." : "Cadastrar veículo"}
                    </button>
                </form>
            </section>
        </main>
    );
}