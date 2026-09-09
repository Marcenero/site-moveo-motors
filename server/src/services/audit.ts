import {
    AcaoAuditoria,
    ResultadoAuditoria,
} from "../generated/prisma/index.js";

import type {
    Prisma,
} from "../generated/prisma/index.js";

import { prisma } from "./prisma.js";

type RegistrarAuditoriaParams = {
    acao: AcaoAuditoria;
    resultado: ResultadoAuditoria;

    adminId: string;

    veiculoId?: number;
    detalhes?: Prisma.InputJsonValue;
}

export async function registrarAuditoria({
    acao,
    resultado,
    adminId,
    veiculoId,
    detalhes,
}: RegistrarAuditoriaParams,

    tx?: Prisma.TransactionClient
) {
    const cliente = tx ?? prisma;

    return cliente.logAuditoria.create({
        data: {
            acao,
            resultado,
            adminId,

            ...(veiculoId !== undefined
                ? { veiculoId }
                : {}),

            ...(detalhes !== undefined
                ? { detalhes }
                : {}),
        },
    });
}