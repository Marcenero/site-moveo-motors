import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

import { verificarAdmin } from "../../../../lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const backendUrl = process.env.BACKEND_INTERNAL_URL;
const segredo = process.env.INTERNAL_AUTH_SECRET;

function obterChave() {
    if (!segredo || Buffer.from(segredo, "base64").length !== 32) {
        throw new Error("INTERNAL_AUTH_SECRET inválido.");
    }

    return Buffer.from(segredo, "base64");
}

type Contexto = {
    params: Promise<{ path: string[] }>;
};

async function encaminhar(request: NextRequest, contexto: Contexto) {
    // Bloqueia chamadas de origens diferentes à aplicação.
    if (!["GET", "HEAD"].includes(request.method)) {
        const origem = request.headers.get("origin");

        if (!origem || origem !== request.nextUrl.origin) {
            return NextResponse.json(
                { ok: false, erro: "Origem não autorizada." },
                { status: 403 }
            );
        }
    }

    const resultado = await verificarAdmin();

    if (!resultado.autorizado) {
        const status = resultado.motivo === "forbidden" ? 403 : 401;

        return NextResponse.json({ ok: false, erro: "Acesso não autorizado." }, { status });
    }

    if (!backendUrl) {
        return NextResponse.json({ ok: false, erro: "Backend indisponível." }, { status: 503 });
    }

    const { path } = await contexto.params;

    // Não permitir segmentos especiais no caminho.
    if (
        path.length === 0 ||
        path.some(
            (segmento) =>
                !segmento ||
                segmento === "." ||
                segmento === ".." ||
                segmento.includes("/") ||
                segmento.includes("\\")
        )
    ) {
        return NextResponse.json({ ok: false, erro: "Caminho inválido." }, { status: 400 });
    }

    // Somente namespaces de API conhecidos.
    if (!["veiculos", "audit"].includes(path[0])) {
        return NextResponse.json({ ok: false, erro: "Rota não permitida." }, { status: 404 });
    }

    const jwt = await new SignJWT({
        email: resultado.usuario.email,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(resultado.usuario.id)
        .setIssuer("moveo-motors-nextjs")
        .setAudience("moveo-motors-express")
        .setIssuedAt()
        .setExpirationTime("60s")
        .sign(obterChave());

    const destino = new URL(
        path.map(encodeURIComponent).join("/"),
        `${backendUrl.replace(/\/$/, "")}/`
    );

    destino.search = request.nextUrl.search;

    const headers = new Headers();

    headers.set("Authorization", `Bearer ${jwt}`);

    const contentType = request.headers.get("content-type");

    if (contentType) {
        headers.set("Content-Type", contentType);
    }

    const possuiCorpo = !["GET", "HEAD"].includes(request.method);

    // Mantém JSON e FormData, incluindo uploads de imagens.
    const corpo = possuiCorpo ? await request.arrayBuffer() : undefined;

    try {
        const response = await fetch(destino, {
            method: request.method,
            headers,
            body: corpo,
            cache: "no-store",
            signal: AbortSignal.timeout(30000),
            redirect: "manual",
        });

        const respostaHeaders = new Headers();

        const tipo = response.headers.get("content-type");

        if (tipo) {
            respostaHeaders.set("Content-Type", tipo);
        }

        respostaHeaders.set("Cache-Control", "no-store");

        return new NextResponse(response.body, {
            status: response.status,
            headers: respostaHeaders,
        });
    } catch {
        return NextResponse.json(
            { ok: false, erro: "Erro ao consultar o backend." },
            { status: 502 }
        );
    }
}

export const GET = encaminhar;
export const POST = encaminhar;
export const PATCH = encaminhar;
export const PUT = encaminhar;
export const DELETE = encaminhar;