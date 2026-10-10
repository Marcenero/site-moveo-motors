"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminFetch } from "../../../lib/adminFetch";
import { logError } from "../../../lib/logger";

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

type ImagemSelecionada = {
    id: string;
    arquivo: File;
    previewUrl: string;
};

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

async function uploadImagensNoBackend(arquivos: File[]): Promise<string[]> {
    const formData = new FormData();
    arquivos.forEach((arquivo) => formData.append("imagens", arquivo));

    const resposta = await adminFetch("/veiculos/upload-imagens", {
        method: "POST",
        body: formData,
    });

    if (!resposta.ok) {
        if (resposta.status === 401) throw new Error("Sua sessão expirou. Faça login novamente.");
        if (resposta.status === 403) throw new Error("Você não possui permissão para enviar imagens.");
        if (resposta.status === 429) {
            throw new Error("Muitos uploads foram realizados. Aguarde alguns minutos e tente novamente.");
        }
        const dadosErro = await resposta.json().catch(() => null);
        throw new Error(dadosErro?.erro || dadosErro?.error || "Erro ao enviar imagens.");
    }

    const dados: unknown = await resposta.json();
    if (
        typeof dados !== "object" || dados === null ||
        !("urls" in dados) || !Array.isArray(dados.urls) ||
        !dados.urls.every((url: unknown) => typeof url === "string")
    ) {
        throw new Error("O servidor retornou uma lista de imagens inválida.");
    }
    return dados.urls as string[];
}

function CampoObrigatorio({ children }: { children: ReactNode }) {
    return <span className="flex items-center gap-1"><span>{children}</span><span className="text-red-600">*</span></span>;
}

function ItemRevisao({ titulo, valor }: { titulo: string; valor: string }) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">{titulo}</p>
            <p className="font-medium text-gray-900">{valor || "-"}</p>
        </div>
    );
}

function formatarPreco(valor: string) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return valor;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numero);
}

function formatarKm(valor: string) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return valor;
    return `${new Intl.NumberFormat("pt-BR").format(numero)} km`;
}

function formatarTamanhoArquivo(bytes: number) {
    return bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(0)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MiniaturaImagem({ imagem, index, remover }: {
    imagem: ImagemSelecionada;
    index: number;
    remover?: (id: string) => void;
}) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="relative aspect-[4/3] w-full bg-gray-100">
                <Image
                    src={imagem.previewUrl}
                    alt={`Prévia ${index + 1} do veículo`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 220px"
                    className="object-cover"
                />

                {index === 0 && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-[#d9a300] px-3 py-1 text-xs font-semibold text-black shadow-sm">
                        Imagem principal
                    </span>
                )}
            </div>
            <div className="space-y-2 p-3">
                <p className="truncate text-xs text-gray-700" title={imagem.arquivo.name}>{imagem.arquivo.name}</p>
                <p className="text-xs text-gray-400">{formatarTamanhoArquivo(imagem.arquivo.size)}</p>
                {remover && (
                    <button
                        type="button"
                        onClick={() => remover(imagem.id)}
                        className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        Remover imagem
                    </button>
                )}
            </div>
        </div>
    );
}

export default function CadastrarVeiculoPage() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [avisoImagens, setAvisoImagens] = useState("");
    const [imagensSelecionadas, setImagensSelecionadas] = useState<ImagemSelecionada[]>([]);
    const previewUrlsRef = useRef<string[]>([]);
    const [outrasInfos, setOutrasInfos] = useState<string[]>([]);
    const [novaInfo, setNovaInfo] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [dadosRevisao, setDadosRevisao] = useState<DadosVeiculoFormulario | null>(null);

    useEffect(() => {
        const urls = previewUrlsRef.current;
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    function adicionarImagens(arquivos: File[]) {
        const validos = arquivos.filter((arquivo) =>
            TIPOS_PERMITIDOS.has(arquivo.type) && arquivo.size > 0 && arquivo.size <= TAMANHO_MAXIMO
        );
        setAvisoImagens(
            validos.length !== arquivos.length
                ? "Algumas imagens foram ignoradas. Utilize JPEG, PNG ou WebP, com até 5 MB por arquivo."
                : ""
        );
        const novasImagens = validos.map((arquivo) => {
            const previewUrl = URL.createObjectURL(arquivo);
            previewUrlsRef.current.push(previewUrl);
            return { id: crypto.randomUUID(), arquivo, previewUrl };
        });
        setImagensSelecionadas((atuais) => [...atuais, ...novasImagens]);
    }

    function removerImagem(id: string) {
        const imagem = imagensSelecionadas.find((item) => item.id === id);
        if (!imagem) return;
        setImagensSelecionadas((atuais) => atuais.filter((item) => item.id !== id));
        URL.revokeObjectURL(imagem.previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== imagem.previewUrl);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        const formData = new FormData(event.currentTarget);
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
            outras_infos: [...outrasInfos],
        };
        setDadosRevisao(dados);
        setModalAberto(true);
    }

    function adicionarOutraInfo() {
        const info = novaInfo.trim();
        if (!info || outrasInfos.some((item) => item.toLowerCase() === info.toLowerCase())) return;
        setOutrasInfos((atuais) => [...atuais, info]);
        setNovaInfo("");
    }

    async function confirmarCadastro() {
        if (!dadosRevisao || carregando) return;
        setErro("");
        setCarregando(true);
        try {
            let imagens: string[] = [];
            if (imagensSelecionadas.length > 0) {
                imagens = await uploadImagensNoBackend(imagensSelecionadas.map((imagem) => imagem.arquivo));
            }
            const resposta = await adminFetch("/veiculos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...dadosRevisao, imagens }),
            });
            if (resposta.status === 401) {
                setModalAberto(false);
                router.push("/admin/login");
                return;
            }
            if (resposta.status === 403) throw new Error("Você não possui permissão para cadastrar veículos.");
            if (!resposta.ok) {
                const dadosErro = await resposta.json().catch(() => null);
                throw new Error(dadosErro?.erro || dadosErro?.error || "Erro ao cadastrar veículo.");
            }
            setModalAberto(false);
            router.push("/admin/disponiveis");
        } catch (error) {
            logError("vehicle_create_failed", error, { component: "admin", operation: "cadastrar_veiculo" });
            setErro(error instanceof Error ? error.message : "Erro ao cadastrar veículo. Verifique os dados e tente novamente.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Cadastrar veículo</h1>
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-black">Dados principais</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {([
                                ["nome", "Nome", "text"],
                                ["ano", "Ano", "number"],
                                ["preco", "Preço", "number"],
                                ["km", "Quilometragem", "number"],
                                ["cor", "Cor", "text"],
                                ["final_placa", "Final da placa", "number"],
                                ["cambio", "Câmbio", "text"],
                                ["motor", "Motor", "text"],
                                ["combustivel", "Combustível", "text"],
                            ] as const).map(([name, label, type]) => (
                                <label key={name} className="grid gap-1 text-sm font-medium text-gray-700">
                                    <CampoObrigatorio>{label}</CampoObrigatorio>
                                    <input
                                        name={name}
                                        type={type}
                                        placeholder={label}
                                        required
                                        min={type === "number" ? "0" : undefined}
                                        max={name === "final_placa" ? "9" : undefined}
                                        step={name === "preco" ? "0.01" : undefined}
                                        className="rounded-lg border p-3"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Descrição</h2>
                        <div className="grid gap-4">
                            <label className="grid gap-1 text-sm font-medium text-gray-700">
                                <CampoObrigatorio>Descrição do veículo</CampoObrigatorio>
                                <textarea name="descricao" placeholder="Descrição" required className="min-h-28 rounded-lg border p-3" />
                            </label>
                            <label htmlFor="nova-info" className="text-sm font-medium text-gray-700">Outras informações</label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    id="nova-info"
                                    type="text"
                                    value={novaInfo}
                                    onChange={(event) => setNovaInfo(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            adicionarOutraInfo();
                                        }
                                    }}
                                    placeholder="Ex.: Chave reserva"
                                    className="flex-1 rounded-lg border p-3"
                                />
                                <button type="button" onClick={adicionarOutraInfo} className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 hover:scale-105">Adicionar</button>
                            </div>
                            <p className="text-xs text-gray-500">Digite uma informação e pressione Enter ou clique em &quot;Adicionar&quot;.</p>
                            {outrasInfos.length > 0 && (
                                <ul className="mt-1 grid gap-2">
                                    {outrasInfos.map((info, index) => (
                                        <li key={`${info}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                                            <span>{info}</span>
                                            <button type="button" onClick={() => setOutrasInfos((atuais) => atuais.filter((_, i) => i !== index))} className="shrink-0 text-red-600 hover:text-red-800">Remover</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Imagens do veículo</h2>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{imagensSelecionadas.length} imagens</span>
                        </div>
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
                            <label className="grid gap-2 text-sm font-medium text-gray-700">
                                Adicionar imagens
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={(event) => {
                                        adicionarImagens(Array.from(event.target.files ?? []));
                                        event.target.value = "";
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white p-3 font-normal"
                                />
                            </label>
                            <p className="mt-2 text-xs text-gray-500">Selecione imagens JPEG, PNG ou WebP. Tamanho máximo: 5 MB por imagem.</p>
                            {avisoImagens && <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{avisoImagens}</p>}
                            {imagensSelecionadas.length > 0 ? (
                                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {imagensSelecionadas.map((imagem, index) => (
                                        <MiniaturaImagem key={imagem.id} imagem={imagem} index={index} remover={removerImagem} />
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-5 rounded-lg bg-white p-4 text-center text-sm text-gray-500">Nenhuma imagem selecionada.</p>
                            )}
                        </div>
                    </section>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input name="estado_ipva" type="checkbox" className="h-5 w-5 accent-black" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">IPVA pago</p>
                                <p className="text-xs text-gray-500">Marque esta opção caso o veículo esteja com o IPVA em dia.</p>
                            </div>
                        </label>
                    </div>

                    {erro && !modalAberto && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{erro}</p>}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                        <button type="button" disabled={carregando} onClick={() => router.push("/admin")} className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60">Cancelar</button>
                        <button type="submit" disabled={carregando} className="rounded-lg border border-green-300 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-60">Revisar cadastro</button>
                    </div>
                </form>
            </section>

            {modalAberto && dadosRevisao && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-confirmacao">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-5">
                            <h2 id="titulo-confirmacao" className="text-xl font-bold text-gray-900">Confirmar cadastro</h2>
                            <p className="mt-1 text-sm text-gray-500">Confira as informações antes de cadastrar o veículo.</p>
                        </div>

                        <div className="space-y-6 p-6">
                            <section>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Dados principais</h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <ItemRevisao titulo="Nome" valor={dadosRevisao.nome} />
                                    <ItemRevisao titulo="Preço" valor={formatarPreco(dadosRevisao.preco)} />
                                    <ItemRevisao titulo="Ano" valor={dadosRevisao.ano} />
                                    <ItemRevisao titulo="Quilometragem" valor={formatarKm(dadosRevisao.km)} />
                                    <ItemRevisao titulo="Cor" valor={dadosRevisao.cor} />
                                    <ItemRevisao titulo="Final da placa" valor={dadosRevisao.final_placa} />
                                    <ItemRevisao titulo="Câmbio" valor={dadosRevisao.cambio} />
                                    <ItemRevisao titulo="Motor" valor={dadosRevisao.motor} />
                                    <ItemRevisao titulo="Combustível" valor={dadosRevisao.combustivel} />
                                    <ItemRevisao titulo="IPVA" valor={dadosRevisao.estado_ipva ? "Pago" : "Não informado como pago"} />
                                </div>
                            </section>
                            <section className="border-t border-gray-200 pt-5">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Descrição</h3>
                                <div className="rounded-xl bg-gray-50 p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{dadosRevisao.descricao}</p>
                                </div>
                            </section>
                            {dadosRevisao.outras_infos.length > 0 && (
                                <section className="border-t border-gray-200 pt-5">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Outras informações</h3>
                                    <ul className="grid gap-2">
                                        {dadosRevisao.outras_infos.map((item, index) => (
                                            <li key={`${item}-${index}`} className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-700">{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                            <section className="border-t border-gray-200 pt-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Imagens do veículo</h3>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{imagensSelecionadas.length} imagens</span>
                                </div>
                                {imagensSelecionadas.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {imagensSelecionadas.map((imagem, index) => <MiniaturaImagem key={imagem.id} imagem={imagem} index={index} />)}
                                    </div>
                                ) : (
                                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Nenhuma imagem foi selecionada para este veículo.</p>
                                )}
                            </section>
                            {erro && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{erro}</p>}
                        </div>

                        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={carregando}
                                onClick={() => { setErro(""); setModalAberto(false); }}
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >Voltar e editar</button>
                            <button
                                type="button"
                                disabled={carregando}
                                onClick={confirmarCadastro}
                                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >{carregando ? "Cadastrando..." : "Confirmar cadastro"}</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}