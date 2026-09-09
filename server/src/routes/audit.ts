import { Router } from "express";

import {
    AcaoAuditoria,
    ResultadoAuditoria,
} from "../generated/prisma/index.js";

import {
    exigirAdmin,
} from "../middlewares/exigirAdmin.js";

import {
    registrarAuditoria,
} from "../services/audit.js";

import {
    prisma,
} from "../services/prisma.js";

const router = Router();

/* Buscar logs de auditoria */
router.get(
    "/",
    exigirAdmin,
    async (req, res) => {
        const pagina = Number(req.query.pagina ?? 1);

        const limite = Number(req.query.limite ?? 25);

        if (
            !Number.isInteger(pagina) ||
            pagina <= 0 ||
            !Number.isInteger(limite) ||
            limite <= 0 ||
            limite > 100
        ) {
            return res
                .status(400)
                .json({
                    ok: false,
                    erro: "Parâmetros de paginação inválidos.",
                });
        }

        try {
            const skip = (pagina - 1) * limite;

            const [logs, total] =
                await prisma.$transaction([
                    prisma.logAuditoria.findMany({
                        orderBy: {
                            createdAt: "desc",
                        },
                        skip,
                        take: limite,
                    }),

                    prisma.logAuditoria.count(),
                ]);

            const logsSerializados =
                logs.map((log) => ({
                    ...log,


                    id: log.id.toString(),
                }));

            return res.json({
                ok: true,
                logs: logsSerializados,
                paginacao: {
                    pagina,
                    limite,
                    total,
                    totalPaginas: Math.ceil(total / limite),
                },
            });
        }
        catch (error) {
            console.error(
                "Erro ao buscar logs de auditoria:",
                error
            );

            return res
                .status(500)
                .json({
                    ok: false,
                    erro: "Erro ao buscar logs de auditoria.",
                });
        }
    }
);

/* Registrar log administrativo */
router.post(
    "/login",
    exigirAdmin,    
    async (req, res) => {
        try {
            await registrarAuditoria({
                acao: AcaoAuditoria.ADMIN_LOGIN,
                resultado: ResultadoAuditoria.SUCESSO,
                adminId: res.locals.usuario.id,
            });

            return res.json({
                ok: true,
            });
        }
        catch (error) {
            console.error(
                "Erro ao registrar login administrativo:",
                error
            );

            return res
                .status(500)
                .json({
                    ok: false,
                    erro: "Erro ao registrar auditoria.",
                });
        }
    }
);

export default router;