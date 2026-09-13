import { Router } from "express";

import { prisma } from "../services/prisma.js";

import { capturarErro } from "../services/monitoring.js";

const router = Router();

router.get(
    "/",
    async (_req, res) => {
        try {
            await prisma.$queryRaw`
                SELECT 1
            `;

            return res.status(200).json({
                ok: true,
                api: "ok",
                database: "ok",
            });
        }
        catch (error) {
            capturarErro(
                error,
                "database",
                "health_check"
            );

            return res.status(503).json({
                ok: false,
                api: "ok",
                database: "unavailable",
            });
        }
    }
);

export default router;