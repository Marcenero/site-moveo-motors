"use client";

import {
    useState,
    type FormEvent,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { adminFetch } from "../../lib/adminFetch";

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

async function uploadImagensNoBackend(
    arquivos: File[]
) {
    const formData = new FormData();

    arquivos.forEach((arquivo) => {
        formData.append(
            "imagens",
            arquivo
        );
    });

    const resposta = await adminFetch(
        "/veiculos/upload-imagens",
        {
            method: "POST",
            body: formData,
        }
    );

    if (!resposta.ok) {
        if (resposta.status === 401) {
            throw new Error(
                "Sua sessão expirou. Faça login novamente."
            );
        }

        if (resposta.status === 403) {
            throw new Error(
                "Você não possui permissão para enviar imagens."
            );
        }

        if (resposta.status === 429) {
            throw new Error(
                "Muitos uploads foram realizados. Aguarde alguns minutos e tente novamente."
            );
        }

        const dadosErro =
            await resposta
                .json()
                .catch(() => null);

        throw new Error(
            dadosErro?.erro ||
            dadosErro?.error ||
            "Erro ao enviar imagens."
        );
    }

    const dados =
        await resposta.json();

    return dados.urls as string[];
}

function CampoObrigatorio({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <span className="flex items-center gap-1">
            <span>{children}</span>

            <span className="text-red-600">
                *
            </span>
        </span>
    );
}

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

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        }
    ).format(numero);
}

function formatarKm(valor: string) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return valor;
    }

    return `${new Intl.NumberFormat(
        "pt-BR"
    ).format(numero)} km`;
}

function formatarTamanhoArquivo(
    bytes: number
) {
    if (bytes < 1024 * 1024) {
        return `${(
            bytes / 1024
        ).toFixed(0)} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;
}

export default function CadastrarVeiculoPage() {
    const router = useRouter();

    const [carregando, setCarregando] =
        useState(false);

    const [erro, setErro] =
        useState("");

    const [arquivos, setArquivos] =
        useState<File[]>([]);

    const [modalAberto, setModalAberto] =
        useState(false);

    const [
        dadosRevisao,
        setDadosRevisao,
    ] =
        useState<DadosVeiculoFormulario | null>(
            null
        );

    /*
     * Primeiro submit:
     * apenas lê o formulário e abre
     * o modal de confirmação.
     */
    function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setErro("");

        const formData =
            new FormData(e.currentTarget);

        const dados:
            DadosVeiculoFormulario = {
            nome: String(
                formData.get("nome") ?? ""
            ).trim(),

            km: String(
                formData.get("km") ?? ""
            ).trim(),

            cor: String(
                formData.get("cor") ?? ""
            ).trim(),

            final_placa: String(
                formData.get(
                    "final_placa"
                ) ?? ""
            ).trim(),

            estado_ipva:
                formData.get(
                    "estado_ipva"
                ) === "on",

            preco: String(
                formData.get("preco") ?? ""
            ).trim(),

            ano: String(
                formData.get("ano") ?? ""
            ).trim(),

            cambio: String(
                formData.get("cambio") ?? ""
            ).trim(),

            motor: String(
                formData.get("motor") ?? ""
            ).trim(),

            combustivel: String(
                formData.get(
                    "combustivel"
                ) ?? ""
            ).trim(),

            descricao: String(
                formData.get(
                    "descricao"
                ) ?? ""
            ).trim(),

            outras_infos: String(
                formData.get(
                    "outras_infos"
                ) ?? ""
            )
                .split("\n")
                .map((item) =>
                    item.trim()
                )
                .filter(Boolean),
        };

        setDadosRevisao(dados);
        setModalAberto(true);
    }

    /*
     * Somente esta função realmente
     * envia os dados para o backend.
     */
    async function confirmarCadastro() {
        if (!dadosRevisao) {
            return;
        }

        setErro("");
        setCarregando(true);

        try {
            let imagens: string[] = [];

            /*
             * As imagens só são enviadas
             * depois da confirmação.
             */
            if (arquivos.length > 0) {
                imagens =
                    await uploadImagensNoBackend(
                        arquivos
                    );
            }

            const payload = {
                ...dadosRevisao,
                imagens,
            };

            const resposta =
                await adminFetch(
                    "/veiculos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

            if (resposta.status === 401) {
                setModalAberto(false);

                router.push(
                    "/admin/login"
                );

                return;
            }

            if (resposta.status === 403) {
                throw new Error(
                    "Você não possui permissão para cadastrar veículos."
                );
            }

            if (!resposta.ok) {
                const dadosErro =
                    await resposta
                        .json()
                        .catch(
                            () => null
                        );

                throw new Error(
                    dadosErro?.erro ||
                    dadosErro?.error ||
                    "Erro ao cadastrar veículo."
                );
            }

            setModalAberto(false);

            router.push(
                "/admin/disponiveis"
            );
        }
        catch (error) {
            console.error(
                "Erro ao cadastrar veículo:",
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar veículo. Verifique os dados e tente novamente."
            );
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

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6"
                >
                    {/* Dados principais */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-black">
                            Dados principais
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Nome
                                </CampoObrigatorio>

                                <input
                                    name="nome"
                                    placeholder="Nome"
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Ano
                                </CampoObrigatorio>

                                <input
                                    name="ano"
                                    type="number"
                                    placeholder="Ano"
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Preço
                                </CampoObrigatorio>

                                <input
                                    name="preco"
                                    type="number"
                                    placeholder="Preço"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Quilometragem
                                </CampoObrigatorio>

                                <input
                                    name="km"
                                    type="number"
                                    placeholder="Km"
                                    required
                                    min="0"
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Cor
                                </CampoObrigatorio>

                                <input
                                    name="cor"
                                    placeholder="Cor"
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Final da placa
                                </CampoObrigatorio>

                                <input
                                    name="final_placa"
                                    type="number"
                                    placeholder="Final da placa"
                                    required
                                    min="0"
                                    max="9"
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Câmbio
                                </CampoObrigatorio>

                                <input
                                    name="cambio"
                                    placeholder="Câmbio"
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Motor
                                </CampoObrigatorio>

                                <input
                                    name="motor"
                                    placeholder="Motor"
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>

                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Combustível
                                </CampoObrigatorio>

                                <input
                                    name="combustivel"
                                    placeholder="Combustível"
                                    required
                                    className="rounded-lg border p-3"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Descrição
                        </h2>

                        <div className="grid gap-4">
                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>
                                    Descrição do veículo
                                </CampoObrigatorio>

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

                    {/* Imagens */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Imagens
                        </h2>

                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
                            <label className="grid gap-2 text-sm font-medium text-gray-700">
                                Imagens do veículo

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(
                                        event
                                    ) => {
                                        const novosArquivos =
                                            Array.from(
                                                event
                                                    .target
                                                    .files ??
                                                    []
                                            );

                                        setArquivos(
                                            (
                                                arquivosAtuais
                                            ) => [
                                                ...arquivosAtuais,
                                                ...novosArquivos,
                                            ]
                                        );

                                        event.target.value =
                                            "";
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white p-3 font-normal"
                                />
                            </label>

                            <p className="mt-2 text-xs text-gray-500">
                                Selecione uma imagem por vez. Elas serão acumuladas na lista abaixo.
                            </p>

                            {arquivos.length >
                                0 && (
                                <div className="mt-3 grid gap-2">
                                    <p className="text-sm text-gray-500">
                                        {
                                            arquivos.length
                                        }{" "}
                                        imagem(ns)
                                        selecionada(s)
                                    </p>

                                    <ul className="grid gap-2">
                                        {arquivos.map(
                                            (
                                                arquivo,
                                                index
                                            ) => (
                                                <li
                                                    key={`${arquivo.name}-${index}`}
                                                    className="flex items-center justify-between rounded-lg bg-white p-3 text-sm text-gray-600"
                                                >
                                                    <span className="truncate">
                                                        {
                                                            arquivo.name
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setArquivos(
                                                                (
                                                                    atuais
                                                                ) =>
                                                                    atuais.filter(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            index
                                                                    )
                                                            );
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remover
                                                    </button>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* IPVA */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                name="estado_ipva"
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

                    {erro &&
                        !modalAberto && (
                            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {erro}
                            </p>
                        )}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            disabled={
                                carregando
                            }
                            onClick={() =>
                                router.push(
                                    "/admin"
                                )
                            }
                            className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={
                                carregando
                            }
                            className="rounded-lg border border-green-300 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-60"
                        >
                            Revisar cadastro
                        </button>
                    </div>
                </form>
            </section>

            {/* Modal de confirmação */}
            {modalAberto &&
                dadosRevisao && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-confirmacao"
                    >
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                            {/* Cabeçalho */}
                            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-5">
                                <h2
                                    id="titulo-confirmacao"
                                    className="text-xl font-bold text-gray-900"
                                >
                                    Confirmar cadastro
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Confira as informações antes de cadastrar o veículo.
                                </p>
                            </div>

                            <div className="space-y-6 p-6">
                                {/* Dados */}
                                <section>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                        Dados principais
                                    </h3>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <ItemRevisao
                                            titulo="Nome"
                                            valor={
                                                dadosRevisao.nome
                                            }
                                        />

                                        <ItemRevisao
                                            titulo="Preço"
                                            valor={formatarPreco(
                                                dadosRevisao.preco
                                            )}
                                        />

                                        <ItemRevisao
                                            titulo="Ano"
                                            valor={
                                                dadosRevisao.ano
                                            }
                                        />

                                        <ItemRevisao
                                            titulo="Quilometragem"
                                            valor={formatarKm(
                                                dadosRevisao.km
                                            )}
                                        />

                                        <ItemRevisao
                                            titulo="Cor"
                                            valor={
                                                dadosRevisao.cor
                                            }
                                        />

                                        <ItemRevisao
                                            titulo="Final da placa"
                                            valor={
                                                dadosRevisao.final_placa
                                            }
                                        />

                                        <ItemRevisao
                                            titulo="Câmbio"
                                            valor={
                                                dadosRevisao.cambio
                                            }
                                        />

                                        <ItemRevisao
                                            titulo="Motor"
                                            valor={
                                                dadosRevisao.motor
                                            }
                                        />

                                        <ItemRevisao
                                            titulo="Combustível"
                                            valor={
                                                dadosRevisao.combustivel
                                            }
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
                                            {
                                                dadosRevisao.descricao
                                            }
                                        </p>
                                    </div>
                                </section>

                                {/* Outras infos */}
                                {dadosRevisao
                                    .outras_infos
                                    .length >
                                    0 && (
                                    <section className="border-t border-gray-200 pt-5">
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                            Outras informações
                                        </h3>

                                        <ul className="grid gap-2">
                                            {dadosRevisao.outras_infos.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <li
                                                        key={
                                                            index
                                                        }
                                                        className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-700"
                                                    >
                                                        {
                                                            item
                                                        }
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </section>
                                )}

                                {/* Imagens */}
                                <section className="border-t border-gray-200 pt-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                            Imagens
                                        </h3>

                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                            {
                                                arquivos.length
                                            }{" "}
                                            {arquivos.length ===
                                            1
                                                ? "imagem"
                                                : "imagens"}
                                        </span>
                                    </div>

                                    {arquivos.length >
                                    0 ? (
                                        <ul className="mt-3 grid gap-2">
                                            {arquivos.map(
                                                (
                                                    arquivo,
                                                    index
                                                ) => (
                                                    <li
                                                        key={`${arquivo.name}-${index}`}
                                                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                                                    >
                                                        <span className="truncate text-sm text-gray-700">
                                                            {
                                                                arquivo.name
                                                            }
                                                        </span>

                                                        <span className="ml-4 shrink-0 text-xs text-gray-400">
                                                            {formatarTamanhoArquivo(
                                                                arquivo.size
                                                            )}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-gray-500">
                                            Nenhuma imagem selecionada.
                                        </p>
                                    )}
                                </section>

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
                                    disabled={
                                        carregando
                                    }
                                    onClick={() => {
                                        setErro(
                                            ""
                                        );

                                        setModalAberto(
                                            false
                                        );
                                    }}
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Voltar e editar
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        carregando
                                    }
                                    onClick={
                                        confirmarCadastro
                                    }
                                    className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {carregando
                                        ? "Cadastrando..."
                                        : "Confirmar cadastro"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </main>
    );
}