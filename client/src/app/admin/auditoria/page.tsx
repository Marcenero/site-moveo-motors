import Link from "next/link";
import { redirect } from "next/navigation";

import {
    ArrowLeft,
    ChevronLeft,
    History,
} from "lucide-react";

import {
    logError,
} from "../../../lib/logger";

import { getPublicApiUrl } from "../../../lib/env.client";

import {
    createClient,
} from "../../../../../supabase/server";

type logAuditoria = {
    id: string;
    createdAt: string;

    acao:
        | "ADMIN_LOGIN"
        | "VEICULO_CRIADO"
        | "VEICULO_ATUALIZADO"
        | "VEICULO_VENDIDO"
        | "IMAGENS_UPLOAD";
    
    resultado:
        | "SUCESSO"
        | "FALHA";

    adminId: string;

    veiculoId:
        | number
        | null;

    detalhes:
        | Record<string, unknown>
        | null;
};

type RespostaAuditoria = {
    ok: boolean;
    logs: logAuditoria[];
    
    paginacao: {
        pagina: number;
        limite: number;
        total: number;
        totalPaginas: number;
    };
};

type AuditoriaPageProps = {
    searchParams: Promise<{
        pagina?: string;
    }>;
};

const API_URL = getPublicApiUrl();

const nomesAcoes:
    Record<
        logAuditoria["acao"],
        string
    > = {
        ADMIN_LOGIN: "Login administrativo",
        VEICULO_CRIADO: "Veículo cadastrado",
        VEICULO_ATUALIZADO: "Veículo atualizado",
        VEICULO_VENDIDO: "Veículo vendido",
        IMAGENS_UPLOAD: "Upload de imagens",
    };

function formatarData(data: string) {
    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "medium",
            timeZone: "America/Sao_Paulo",
        }
    ).format(new Date(data))
}

function formatarDetalhes(
    detalhes:
        | Record<string, unknown>
        | null
) {
    if (!detalhes) {
        return "-";
    }

    if (typeof detalhes.quantidadeImagens === "number") {
        return (`${detalhes.quantidadeImagens} imagem(ns)`);
    }

    if (Array.isArray(detalhes.camposAlterados)) {
        return (detalhes.camposAlterados.join(","));
    }

    if (typeof detalhes.motivo === "string") {
        return detalhes.motivo;
    }

    return JSON.stringify(detalhes);
}

export default async function AuditoriaPage({
    searchParams,
}: AuditoriaPageProps) {
    const params = await searchParams;

    const paginaSolicitada = Number(params.pagina ?? 1);

    const pagina =
        Number.isInteger(paginaSolicitada) && paginaSolicitada > 0
            ? paginaSolicitada
            : 1;

    const supabase = await createClient();

    const {
        data: {
            user,
        },
        error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
        redirect("/admin/login");
    }

    const {
        data: {
            session,
        },
        error: erroSessao,
    } = await supabase.auth.getSession();

    if (erroSessao || !session?.access_token) {
        redirect("/admin/login");
    }

    let logs: logAuditoria[] = [];
    let total = 0;
    let totalPaginas = 1;

    let erro = "";

    try {
        const response =
            await fetch(
                `${API_URL}/audit?pagina=${pagina}&limite=25`,
                {
                    cache: "no-store",

                    headers: {
                        Authorization:
                            `Bearer ${session.access_token}`,
                    },
                }
            );

        if (response.status === 401) {
            redirect("/admin/login?error=session");
        }

        if (response.status === 403) {
            redirect("/admin/login?error=forbidden");
        }

        if (!response.ok) {
            throw new Error("Erro ao buscar logs.");
        }

        const dados:
            RespostaAuditoria = await response.json();

        logs =
            Array.isArray(
                dados.logs
            )
                ? dados.logs
                : [];

        total =
            dados
                .paginacao
                .total;

        totalPaginas =
            Math.max(
                dados
                    .paginacao
                    .totalPaginas,
                1
            );
    }
    catch (error) {
        logError(
            "audit_page_load_failed",
            error,
            {
                component: "audit",
                operation: "carregar_auditoria",
            }
        );

        erro = "Não foi possível carregar os logs de auditoria";
    }

    return (
        <main className="min-h-screen bg-[#f7f7f7] p-6">
            <section className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gray-100 p-3">
                            <History 
                                size={26}
                                className="text-gray-800"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Logs de auditoria
                            </h1>

                            <p className="text-sm text-gray-500">
                                Histórico de ações administrativas
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        <ArrowLeft size={22} />

                        Voltar ao painel   
                    </Link>
                </div>

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total de registros
                    </p>

                    <strong className="text-3xl text-gray-900">
                        {total}
                    </strong>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {erro ? (
                        <div className="p-8 text-center text-red-600">
                            {erro}
                        </div>
                    ) : logs.length === 0? (
                        <div className="p-8 text-center text-gray-500">
                            Nenhum log de auditoria encontrado.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[950px] text-left text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="p-4">
                                            Data
                                        </th>

                                        <th className="p-4">
                                            Ação
                                        </th>

                                        <th className="p-4">
                                            Resultado
                                        </th>

                                        <th className="p-4">
                                            Administrador
                                        </th>

                                        <th className="p-4">
                                            Veículo
                                        </th>

                                        <th className="p-4">
                                            Detalhes
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {logs.map(
                                        (
                                            log
                                        ) => (
                                            <tr 
                                                key={log.id}
                                                className="border-b border-gray-100last:border-0"
                                            >
                                                <td className="whitespace-nowrap p-4 text-gray-600">
                                                    {formatarData(log.createdAt)}
                                                </td>

                                                <td className="p-4 font-medium text-gray-900">
                                                    {
                                                        nomesAcoes[
                                                            log.acao
                                                        ] ??
                                                        log.acao
                                                    }
                                                </td>

                                                <td className="p-4">
                                                    <span className={`
                                                        inline-flex rounded-full px-3 py-1 text-xs font-semibold
                                                        ${
                                                            log.resultado ===
                                                                "SUCESSO"
                                                                    ?"bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                        }    
                                                    `}>
                                                        {log.resultado}
                                                    </span>
                                                </td>

                                                <td 
                                                    className="p-4 font-mono text-xs text-gray-600"
                                                    title={log.adminId}
                                                >
                                                    {log.adminId.slice(0, 8)}...
                                                </td>

                                                <td className="p-4 text-gray-600">
                                                    {log.veiculoId ?? "-"}
                                                </td>

                                                <td className="max-w-sm p-4 text-gray-600">
                                                    {formatarDetalhes(log.detalhes)}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!erro &&
                        totalPaginas > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 p-4">
                                <p className="text-sm text-gray-500">
                                    Página{" "}
                                    {pagina} de{" "}
                                    {
                                        totalPaginas
                                    }
                                </p>

                                <div className="flex gap-2">
                                    {pagina > 1 && (
                                        <Link
                                            href={`/admin/auditoria?pagina=${pagina - 1}`}
                                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                                        >
                                            <ChevronLeft size={16} />

                                            Anterior
                                        </Link>
                                    )}

                                    {pagina < totalPaginas && (
                                        <Link
                                            href={`/admin/auditoria?pagina=${pagina + 1}`}
                                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                                        >
                                            <ChevronLeft size={16} />

                                            Próxima
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            </section>
        </main>
    );
}