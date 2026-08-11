import { Router } from "express";
import { supabase } from "../services/supabase.js";
import multer from "multer";

const router = Router();

/* Funções */
/* Funções auxiliares para a rota de informações da tabela */
function pegarDataHojeBrasil() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function pegarDataLimiteBrasil() {
    const hoje = new Date();

    // 4 dias antes de hoje, porque hoje conta como um dos 5 dias
    hoje.setDate(hoje.getDate() - 4);

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(hoje);
}

async function limparVendasAntigas() {
    const dataLimite = pegarDataLimiteBrasil();

    const { error } = await supabase
        .from("VendaDia")
        .delete()
        .lt("data", dataLimite);

    if (error) {
        throw error;
    }
}

async function incrementarVendaDoDia() {
    const dataHoje = pegarDataHojeBrasil();

    const { data: vendaExistente, error: erroConsulta } = await supabase
        .from("VendaDia")
        .select("id, quantidade")
        .eq("data", dataHoje)
        .maybeSingle();

    if (erroConsulta) {
        throw erroConsulta;
    }

    if (vendaExistente) {
        const { error: erroUpdate } = await supabase
            .from("VendaDia")
            .update({
                quantidade: vendaExistente.quantidade + 1,
            })
            .eq("id", vendaExistente.id);

        if (erroUpdate) {
            throw erroUpdate;
        }
    }
    else {
        const { error: erroInsert } = await supabase
            .from("VendaDia")
            .insert({
                data: dataHoje,
                quantidade: 1,
            });

        if (erroInsert) {
            throw erroInsert;
        }
    }

    await limparVendasAntigas();
}

/* Rotas */
/* Rota para pegar todos os veículos do banco de dados */
router.get("/", async (req, res) => {
    console.log("GET /veiculos chamado");

    const { data: veiculos, error } = await supabase
        .from("Veiculo")
        .select(`
                *,
                imagens:ImagemVeiculo (
                    id,
                    url,
                    veiculoId
                )
            `);

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

/* Rota para cadastro de veículo */
router.post("/", async (req, res) => {
    const {
        nome,
        km,
        cor,
        final_placa,
        estado_ipva,
        preco,
        ano,
        cambio,
        motor,
        combustivel,
        descricao,
        outras_infos,
        imagens,
    } = req.body;

    const ipvaPago =
        estado_ipva === true ||
        estado_ipva === "true" ||
        estado_ipva === "on";

    const { data: veiculo, error: erroVeiculo } = await supabase
        .from("Veiculo")
        .insert({
            nome,
            km: Number(km),
            cor,
            final_placa: Number(final_placa),
            estado_ipva: ipvaPago,
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
        console.error("Erro ao inserir veículo:", erroVeiculo);

        return res.status(500).json({
            ok: false,
            etapa: "cadastro_veiculo",
            erro: erroVeiculo.message,
            detalhes: erroVeiculo,
        });
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

/* Rota para upload de imagens no cadastro */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

router.post("/upload-imagens", upload.array("imagens"), async (req, res) => {
    try {
        const arquivos = req.files as Express.Multer.File[];

        if (!arquivos || arquivos.length === 0) {
            return res.status(400).json({
                ok: false,
                error: "Nenhuma imagem enviada.",
            });
        }

        const urls: string[] = [];

        for (const arquivo of arquivos) {
            const extensao = arquivo.originalname.split(".").pop();
            const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;
            const caminho = `veiculos/${nomeArquivo}`;

            const { error } = await supabase.storage
                .from("Imagens")
                .upload(caminho, arquivo.buffer, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: arquivo.mimetype,
                });

            if (error) {
                throw error;
            }

            const { data } = supabase.storage
                .from("Imagens")
                .getPublicUrl(caminho);

            urls.push(data.publicUrl);
        }

        return res.json({
            ok: true,
            urls,
        });
    }
    catch (error) {
        console.error("Erro ao enviar imagens:", error);

        return res.status(500).json({
            ok: false,
            error: "Erro ao enviar imagens.",
        });
    }
});

/* Rota para atualizar a tabela de vendas do dia */
router.get("/vendas/ultimos-5-dias", async (req, res) => {
    try {
        const hoje = new Date();

        const datas = Array.from({ length: 5 }, (_, index) => {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() - (4 - index));

            return new Intl.DateTimeFormat("en-CA", {
                timeZone: "America/Sao_Paulo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(data);
        });

        const { data: vendas, error } = await supabase
            .from("VendaDia")
            .select("data, quantidade")
            .in("data", datas);

        if (error) {
            return res.status(500).json({
                ok: false,
                erro: error.message,
            });
        }

        const mapaVendas = new Map(
            (vendas ?? []).map((venda) => [
                venda.data,
                venda.quantidade,
            ])
        );

        const resultado = datas.map((data) => {
            const [, mes, dia] = data.split("-");

            return {
                data,
                dia: `${Number(dia)}/${Number(mes)}`,
                vendidos: mapaVendas.get(data) ?? 0,
            };
        });

        return res.json({
            ok: true,
            vendas: resultado,
        });
    }
    catch (error) {
        console.error("Erro ao buscar vendas dos últimos 5 dias:", error);

        return res.status(500).json({
            ok: false,
            erro: "Erro ao buscar vendas dos últimos 5 dias.",
        });
    }
});

/* Rota para pegar dados do veículo específico */
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            ok: false,
            erro: "ID inválido",
        });
    }

    try {
        const { data: veiculo, error: erroVeiculo } = await supabase
            .from("Veiculo")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (erroVeiculo) {
            return res.status(500).json({
                ok: false,
                erro: erroVeiculo.message,
            });
        }

        if (!veiculo) {
            return res.status(404).json({
                ok: false,
                erro: "Veículo não encontrado.",
            });
        }

        const { data: imagens, error: erroImagens } = await supabase
            .from("ImagemVeiculo")
            .select("id, url")
            .eq("veiculoId", id);

        if (erroImagens) {
            return res.status(500).json({
                ok: false,
                erro: erroImagens.message,
            });
        }

        return res.json({
            ok: true,
            veiculo: {
                ...veiculo,
                imagens: imagens ?? [],
            },
        });
    }
    catch (error) {
        console.error("Erro ao buscar veículo por ID:", error);

        return res.status(500).json({
            ok: false,
            erro: "Erro ao buscar veículo.",
        });
    }
});

/* Rota para editar informações de um veículo */
router.patch("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            ok: false,
            erro: "ID inválido.",
        });
    }

    const {
        nome,
        km,
        cor,
        final_placa,
        estado_ipva,
        preco,
        ano,
        cambio,
        motor,
        combustivel,
        descricao,
        outras_infos,
    } = req.body;

    const ipvaPago =
        estado_ipva === true ||
        estado_ipva === "true" ||
        estado_ipva === "on";

    try {
        const { data: veiculoAtualizado, error } = await supabase
            .from("Veiculo")
            .update({
                nome,
                km: Number(km),
                cor,
                final_placa: Number(final_placa),
                estado_ipva: ipvaPago,
                preco: Number(preco),
                ano: Number(ano),
                cambio,
                motor,
                combustivel,
                descricao,
                outras_infos: outras_infos ?? [],
            })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) {
            console.error("Erro ao editar veículo:", error);

            return res.status(500).json({
                ok: false,
                erro: error.message,
            });
        }

        if (!veiculoAtualizado) {
            return res.status(404).json({
                ok: false,
                erro: "Veículo não encontrado.",
            });
        }

        return res.json({
            ok: true,
            mensagem: "Veículo atualizado com sucesso.",
            veiculo: veiculoAtualizado,
        });
    }
    catch (error) {
        console.error("Erro inesperado ao editar veículo:", error);

        return res.status(500).json({
            ok: false,
            erro: "Erro inesperado ao editar veículo.",
        });
    }
});

/* Rota para indicar veículos como vendidos */
router.patch("/:id/vendido", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            ok: false,
            erro: "ID inválido",
        });
    }

    try {
        const { error: erroImagens } = await supabase
            .from("ImagemVeiculo")
            .delete()
            .eq("veiculoId", id);

        if (erroImagens) {
            return res.status(500).json({
                ok: false,
                erro: erroImagens.message,
            });
        }

        // Depois apaga o veículo
        const { data: veiculoRemovido, error: erroVeiculo } = await supabase
            .from("Veiculo")
            .delete()
            .eq("id", id)
            .select("id")
            .maybeSingle();

        if (erroVeiculo) {
            return res.status(500).json({
                ok: false,
                erro: erroVeiculo.message,
            });
        }

        if (!veiculoRemovido) {
            return res.status(404).json({
                ok: false,
                erro: "Veículo não encontrado.",
            });
        }

        await incrementarVendaDoDia();

        return res.json({
            ok: true,
            mensagem: "Veículo vendido e removido com sucesso.",
        });
    }
    catch (error) {
        console.error("Erro ao remover veículo vendido:", error);

        return res.status(500).json({
            ok: false,
            erro: "Erro ao remover o veículo vendido.",
        });
    }
});

export default router;