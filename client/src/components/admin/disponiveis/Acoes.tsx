"use client";

import Link from "next/link";
import { useState } from "react";
import { 
    Edit,
    CheckCircle,
    Eye,
    X,
    AlertTriangle,
} from "lucide-react";

import type { Veiculo } from "../../../types/veiculo";

type AcoesProps = {
    veiculo: Veiculo;
    marcarComoVendido: (id: number) => Promise<boolean>;
}

function gerarSlug(texto: string) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function Acoes({ veiculo, marcarComoVendido }: AcoesProps) { 
    const [modalAberto, setModalAberto] = useState(false);
    const [confirmado, setConfirmado] = useState(false);
    const [processando, setProcessando] = useState(false);
    
    const imagemPrincipal = veiculo.imagens?.[0]?.url;

    function abrirModalVenda() {
        setConfirmado(false);
        setModalAberto(true);
    }

    function fecharModalVenda() {
        if (processando) {
            return;
        }

        setConfirmado(false);
        setModalAberto(false);
    }

    async function confirmarVenda() {
        if (!confirmado || processando) {
            return;
        }

        setProcessando(true);

        try {
            const sucesso = await marcarComoVendido(veiculo.id);

            if (sucesso) {
                setModalAberto(false);
            }
        }
        finally {
            setProcessando(false);
        }
    }

    return (
        <>
            {/* Card do veículo */}
            <div
                key={veiculo.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-xl font-bold text-gray-900">
                    {veiculo.nome}
                </h2>

                <p className="flex flex-wrap gap-1.5 mb-5 text-sm text-gray-500">
                    <span>{veiculo.ano}</span>
                    <span>&#8226;</span>
                    <span>{veiculo.km} km</span>
                    <span>&#8226;</span>
                    <span>{veiculo.cambio}</span>
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                    R$ {veiculo.preco.toLocaleString("pt-BR")}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        href={`/admin/editar/${veiculo.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                        <Edit size={16} />
                        Editar
                    </Link>

                    <Link
                        href={`/estoque/${gerarSlug(`${veiculo.nome}-${veiculo.ano}`)}-${veiculo.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-800"
                    >
                        <Eye size={16} />
                        Detalhes
                    </Link>

                    <button
                        type="button"
                        onClick={abrirModalVenda}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                    >
                        <CheckCircle size={16} />
                        Vendido
                    </button>
                </div>
            </div>

            {/* Modal de confirmação */}
            {modalAberto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={fecharModalVenda}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`titulo-venda-${veiculo.id}`}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                    >
                        {/* Cabeçalho */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-100 p-2 text-red-600">
                                    <AlertTriangle size={22} />
                                </div>

                                <div>
                                    <h2
                                        id={`titulo-venda-${veiculo.id}`}
                                        className="text-xl font-bold text-gray-900"
                                    >
                                        Confirmar venda
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Confira se este é exatamente o veículo vendido.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={fecharModalVenda}
                                disabled={processando}
                                aria-label="Fechar"
                                className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Informações do veículo */}
                        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                            {imagemPrincipal ? (
                                <img 
                                    src={imagemPrincipal}
                                    alt={`Foto do veículo ${veiculo.nome}`}
                                    className="h-52 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-52 items-center justify-center bg-gray-100 text-sm text-gray-500">
                                    Veículo sem imagem
                                </div>
                            )}

                            <div className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {veiculo.nome}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Código do veículo: #{veiculo.id}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span className="block text-xs text-gray-500">
                                            Final da placa
                                        </span>

                                        <strong className="text-lg text-gray-900">
                                            {veiculo.final_placa}
                                        </strong>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">
                                            Ano
                                        </span>

                                        <strong className="text-gray-900">
                                            {veiculo.ano}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="block text-gray-500">
                                            Cor
                                        </span>

                                        <strong className="text-gray-900">
                                            {veiculo.cor}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="block text-gray-500">
                                            Quilometragem
                                        </span>

                                        <strong className="text-gray-900">
                                            {veiculo.km.toLocaleString("pt-BR")} km
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="block text-gray-500">
                                            Câmbio
                                        </span>

                                        <strong className="text-gray-900">
                                            {veiculo.cambio}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Aviso */}
                        <div className="mt-4 rounded-xl bg-red-50 p-4">
                            <p className="text-sm text-red-800">
                                Ao confirmar, este veículo será removido
                                do estoque. Verifique principalmente a
                                foto, o código do veículo e o final da
                                placa.
                            </p>
                        </div>

                        {/* Checkbox */}
                        <label className="mt-5 flex cursor-pointer items-start gap-3">
                            <input 
                                type="checkbox"
                                checked={confirmado}
                                disabled={processando}
                                onChange={(event) =>
                                    setConfirmado(event.target.checked)
                                }
                                className="mt-1 h-4 w-4"
                            />

                            <span className="text-sm text-gray-700">
                                Conferi a foto e os dados e confirmo
                                que este é o veículo vendido.
                            </span>
                        </label>

                        {/* Ações */}
                        <div className="mt-5 grid grid-cols-2 gap-x-4">
                            <button
                                type="button"
                                onClick={fecharModalVenda}
                                disabled={processando}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarVenda}
                                disabled={!confirmado || processando}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processando
                                    ? "Confirmando..."
                                    : "Confirmar venda"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}