import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    const veiculos = await prisma.veiculo.findMany();

    res.json(veiculos);
});

export default router;