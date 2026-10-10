"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";

export type FotoEdicao = {
    chave: string;
    id?: number;
    url: string;
    arquivo?: File;
}

type Props = {
    fotos: FotoEdicao[];
    setFotos: Dispatch<SetStateAction<FotoEdicao[]>>;
    remover: (chave: string) => void;
    desabilitado?: boolean;
}

function FotoOrdenavel({
    foto,
    index,
    total,
    remover,
    mover,
    desabilitado,
}: {
    foto: FotoEdicao;
    index: number;
    total: number;
    remover: (chave: string) => void;
    mover: (origem: number, destino: number) => void;
    desabilitado: boolean;
}) {
    const { ref, handleRef, isDragging } = useSortable({
        id: foto.chave,
        index,
        disabled: desabilitado,
    });

    return (
        <div
            ref={ref}
            className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            <div className="relative aspect-[4/3] w-full bg-gray-100">
                <Image 
                    src={foto.url}
                    alt={`Foto ${index+1}`}
                    fill
                    unoptimized={Boolean(foto.arquivo)}
                    sizes="(max-width: 640px) 50vw, 220px"
                    className="object-cover"
                />

                {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#d9a300] px-3 py-1 text-xs font-semibold text-black shadow-sm">
                        Foto principal
                    </span>
                )}
            </div>

            <div className="space-y-2 p-3">
                <p className="truncate text-xs text-gray-600">
                    {foto.arquivo?.name ??
                        `Foto ${index+1} cadastrada`}
                </p>

                <div className="flex items-center justify-between gap-1">
                    <button
                        ref={handleRef}
                        type="button"
                        disabled={desabilitado}
                        className="cursor-grab touch-none rounded-lg border px-2 py-1.5 text-xs text-gray-700 disabled:opacity-50"
                        aria-label={`Arrastar foto ${index+1} para reorganizar`}
                    >
                        Arrastar
                    </button>

                    <div className="flex gap-1">
                        <button
                            type="button"
                            disabled={desabilitado || index === 0}
                            onClick={() => mover(index, index-1)}
                            aria-label={`Mover foto ${index+1} para trás`}
                            className="rounded-lg border px-2 py-1.5 text-xs disabled:opacity-30"
                        >
                            &larr;
                        </button>

                        <button
                            type="button"
                            disabled={desabilitado || index === total - 1}
                            onClick={() => mover(index, index+1)}
                            aria-label={`Mover foto ${index+1} para frente`}
                            className="rounded-lg border px-2 py-1.5 text-xs disabled:opacity-30"
                        >
                            &rarr;
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={desabilitado}
                    onClick={() => remover(foto.chave)}
                    className="w-full rounded-lg border border-red-200  px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                    Remover
                </button>
            </div>
        </div>
    );
}

export function GaleriaOrdenavel({
    fotos,
    setFotos,
    remover,
    desabilitado = false,
}: Props) {
    function mover(origem: number, destino: number) {
        setFotos((atuais) => {
            if (
                origem < 0 ||
                destino < 0 ||
                origem >= atuais.length ||
                destino >= atuais.length
            ) {
                return atuais;
            }

            const atualizadas = [...atuais];

            const [movida] = atualizadas.splice(origem, 1);

            atualizadas.splice(destino, 0, movida);

            return atualizadas;
        });
    }

    if (fotos.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                Este veículo não possui fotografias na lista.
            </p>
        );
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled || desabilitado) return;

                const { source } = event.operation;

                if (isSortable(source)) {
                    mover(source.initialIndex, source.index);
                }
            }}
        >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {fotos.map((foto, index) => (
                    <FotoOrdenavel 
                        key={foto.chave}
                        foto={foto}
                        index={index}
                        total={fotos.length}
                        remover={remover}
                        mover={mover}
                        desabilitado={desabilitado}
                    />
                ))}
            </div>
        </DragDropProvider>
    );
}

export function GaleriaRevisao({
    fotos,
}: {
    fotos: FotoEdicao[];
}) {
    if (fotos.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                Nenhuma imagem selecionada.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fotos.map((foto, index) => (
                <div
                    key={foto.chave}
                    className="overflow-hidden rounded-xl border bg-white"
                >
                    <div className="relative aspect-[4/3] bg-gray-100">
                        <Image 
                            src={foto.url}
                            alt={`Foto ${index+1} para revisão`}
                            fill
                            unoptimized={Boolean(foto.arquivo)}
                            sizes="(max-width: 640px) 50vw, 200px"
                            className="object-cover"
                        />

                        {index === 0 && (
                            <span className="absolute left-2 top-2 rounded-full bg-[#d9a300] px-2 py-1 text-[10px] font-semibold text-black">
                                Foto principal
                            </span>
                        )}
                    </div>

                    <p className="truncate px-3 py-2 text-xs text-gray-600">
                        {foto.arquivo
                            ? `Nova: ${foto.arquivo.name}`
                            : `Foto ${index+1}`}
                    </p>
                </div>
            ))}
        </div>
    );
}