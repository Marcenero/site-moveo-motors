import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

router.get("/", async (req, res) => {
    console.log("GET /veiculos chamado");

    const { data: veiculos, error } = await supabase
        .from("Veiculo")
        .select("*");

    if (error) {
        console.error("Erro supabase:", error);

        return res.status(500).json({
            ok: false,
            error: error.message,
            details: error,
        });
    }

    //console.log("Veículos encontrados:", veiculos?.length ?? 0);
    //console.log("Primeiro veículo:", veiculos?.[0]);

    return res.json({
        ok: true,
        total: veiculos?.length ?? 0,
        veiculos: veiculos ?? [],
    });
});

router.get("/recentes", async (req, res) => {
    console.log("GET /veiculos/recentes chamado");

    const { data: veiculos, error } = await supabase
        .from("Veiculo")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(3);

    if (error) {
        return res.status(500).json({
            error: error.message,
        });
    }

    console.log("Veículos encontrados:", veiculos?.length ?? 0);

    return res.json({
        ok: true,
        veiculos: veiculos ?? [],
    });
});

router.post("/", async (req, res) => {
    const {
        nome,
        km,
        cor,
        final_placa,
        estado_IPVA,
        preco,
        ano,
        cambio,
        motor,
        combustivel,
        descricao,
        outras_infos,
        imagens,
    } = req.body;

    const { data: veiculo, error: erroVeiculo } = await supabase
        .from("Veiculo")
        .insert({
            nome,
            km: Number(km),
            cor,
            final_placa: Number(final_placa),
            estado_IPVA: Boolean(estado_IPVA),
            preco: Number(preco),
            ano: Number(ano),
            cambio,
            motor,
            combustivel,
            descricao,
            outras_infos: outras_infos ?? [],
        })
        .select()
        .single();

    if (erroVeiculo) {
        return res.status(500).json({ error: erroVeiculo.message });
    }

    if (imagens?.length > 0) {
        const imagensFormatadas = imagens.map((url: string) => ({
            url,
            veiculoId: veiculo.id,
        }));

        const { error: erroImagens } = await supabase
            .from("ImagemVeiculo")
            .insert(imagensFormatadas);

        if (erroImagens) {
            return res.status(500).json({ error: erroImagens.message });
        }
    }

    return res.status(201).json({
        ok: true,
        veiculo,
    });
});

export default router;