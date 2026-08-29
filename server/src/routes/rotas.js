import { Router } from "express";
import { supabase } from "../services/supabase.js";
import { prisma } from "../services/prisma.js";
import multer from "multer";
import sharp from "sharp";
import { exigirAdmin } from "../middlewares/exigirAdmin.js";
import { rateLimit } from "express-rate-limit";
import { atualizarVeiculoSchema, criarVeiculoSchema, formatarErrosZod, idVeiculoSchema, } from "../schemas/veiculo.js";
const router = Router();
/* Funções */
function extrairCaminhoStorageDaUrl(url) {
    try {
        const marcador = "/storage/v1/object/public/Imagens/";
        const indice = url.indexOf(marcador);
        if (indice === -1) {
            return null;
        }
        const caminho = decodeURIComponent(url.slice(indice + marcador.length));
        if (!caminho.startsWith("veiculos/")) {
            return null;
        }
        return caminho;
    }
    catch {
        return null;
    }
}
async function removerImagensOrfas(urls) {
    if (urls.length === 0) {
        return;
    }
    const urlsUnicas = [
        ...new Set(urls),
    ];
    const imagensReferenciadas = await prisma.imagemVeiculo.findMany({
        where: {
            url: {
                in: urlsUnicas,
            },
        },
        select: {
            url: true,
        },
    });
    const urlsReferenciadas = new Set(imagensReferenciadas.map((imagem) => imagem.url));
    const caminhosOrfaos = urlsUnicas
        .filter((url) => !urlsReferenciadas.has(url))
        .map(extrairCaminhoStorageDaUrl)
        .filter((caminho) => caminho !== null);
    if (caminhosOrfaos.length === 0) {
        return;
    }
    const { error } = await supabase.storage
        .from("Imagens")
        .remove(caminhosOrfaos);
    if (error) {
        throw error;
    }
}
/* Funções auxiliares para a rota de informações da tabela */
function dataStringParaDate(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        throw new Error(`Data inválida: ${data}`);
    }
    const ano = Number(data.slice(0, 4));
    const mes = Number(data.slice(5, 7));
    const dia = Number(data.slice(8, 10));
    return new Date(Date.UTC(ano, mes - 1, dia));
}
function dateParaDataString(data) {
    return data
        .toISOString()
        .slice(0, 10);
}
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
async function incrementarVendaDoDia(tx) {
    const dataHoje = dataStringParaDate(pegarDataHojeBrasil());
    const dataLimite = dataStringParaDate(pegarDataLimiteBrasil());
    await tx.vendaDia.upsert({
        where: {
            data: dataHoje,
        },
        update: {
            quantidade: {
                increment: 1,
            },
        },
        create: {
            data: dataHoje,
            quantidade: 1,
        },
    });
    await tx.vendaDia.deleteMany({
        where: {
            data: {
                lt: dataLimite,
            },
        },
    });
}
/* Rotas */
/* Rota para pegar todos os veículos do banco de dados */
router.get("/", async (req, res) => {
    try {
        const veiculos = await prisma.veiculo.findMany({
            include: {
                imagens: {
                    select: {
                        id: true,
                        url: true,
                        veiculoId: true,
                    },
                },
            },
        });
        return res.json({
            ok: true,
            total: veiculos.length,
            veiculos,
        });
    }
    catch (error) {
        console.error("Erro ao buscar veículos:", error);
        return res.status(500).json({
            ok: false,
            erro: "Erro ao buscar veículos.",
        });
    }
});
/* Rota para cadastro de veículo */
router.post("/", exigirAdmin, async (req, res) => {
    const resultado = criarVeiculoSchema.safeParse(req.body);
    if (!resultado.success) {
        return res
            .status(400)
            .json({
            ok: false,
            erro: "Dados do veículo inválidos.",
            campos: formatarErrosZod(resultado.error),
        });
    }
    const { imagens, ...dadosVeiculo } = resultado.data;
    try {
        const veiculo = await prisma.veiculo.create({
            data: {
                ...dadosVeiculo,
                ...(imagens.length > 0
                    ? {
                        imagens: {
                            create: imagens.map((url) => ({
                                url,
                            })),
                        },
                    }
                    : {}),
            },
            include: {
                imagens: true,
            },
        });
        return res
            .status(201)
            .json({
            ok: true,
            veiculo,
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar veículo:", error);
        try {
            await removerImagensOrfas(imagens);
        }
        catch (erroLimpeza) {
            console.error("Erro remover imagens órfãs após falha no cadastro:", erroLimpeza);
        }
        return res
            .status(500)
            .json({
            ok: false,
            erro: "Erro ao cadastrar veículo.",
        });
    }
});
/* Rota para upload de imagens no cadastro */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024,
        files: 20,
        fields: 0,
        parts: 20,
    },
    fileFilter: (req, file, callback) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        if (!tiposPermitidos.includes(file.mimetype)) {
            return callback(new Error("Formato de imagem não permitido. Utilize JPG, PNG ou WebP."));
        }
        callback(null, true);
    },
});
const limiteUpload = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        ok: false,
        erro: "Muitos uploads. Aguarde alguns minutos.",
    },
});
router.post("/upload-imagens", exigirAdmin, limiteUpload, upload.array("imagens", 20), async (req, res) => {
    const caminhosEnviados = [];
    try {
        const arquivos = req.files;
        if (!arquivos || arquivos.length === 0) {
            return res.status(400).json({
                ok: false,
                erro: "Nenhuma imagem enviada.",
            });
        }
        const urls = [];
        for (const arquivo of arquivos) {
            const imagemOtimizada = await sharp(arquivo.buffer)
                .rotate()
                .resize({
                width: 1920,
                height: 1920,
                fit: "inside",
                withoutEnlargement: true,
            })
                .webp({
                quality: 82,
                effort: 4,
            })
                .toBuffer();
            const nomeArquivo = `${crypto.randomUUID()}.webp`;
            const caminho = `veiculos/${nomeArquivo}`;
            const { error } = await supabase.storage
                .from("Imagens")
                .upload(caminho, imagemOtimizada, {
                cacheControl: "31536000",
                upsert: false,
                contentType: "image/webp",
            });
            if (error) {
                throw error;
            }
            caminhosEnviados.push(caminho);
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
        if (caminhosEnviados.length > 0) {
            const { error: erroLimpeza, } = await supabase.storage
                .from("Imagens")
                .remove(caminhosEnviados);
            if (erroLimpeza) {
                console.error("Erro ao limpar imagens após falha no upload:", erroLimpeza);
            }
        }
        return res
            .status(500)
            .json({
            ok: false,
            erro: "Erro ao enviar imagens.",
        });
    }
});
/* Rota para atualizar a tabela de vendas do dia */
router.get("/vendas/ultimos-5-dias", exigirAdmin, async (req, res) => {
    try {
        const hoje = new Date();
        const datas = Array.from({ length: 5 }, (_, index) => {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() -
                (4 - index));
            return new Intl.DateTimeFormat("en-CA", {
                timeZone: "America/Sao_Paulo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(data);
        });
        const datasDate = datas.map(dataStringParaDate);
        const vendas = await prisma.vendaDia.findMany({
            where: {
                data: {
                    in: datasDate,
                },
            },
            select: {
                data: true,
                quantidade: true,
            },
        });
        const mapaVendas = new Map(vendas.map((venda) => [
            dateParaDataString(venda.data),
            venda.quantidade,
        ]));
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
            erro: "ID inválido.",
        });
    }
    try {
        const veiculo = await prisma.veiculo.findUnique({
            where: {
                id,
            },
            include: {
                imagens: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
        });
        if (!veiculo) {
            return res.status(404).json({
                ok: false,
                erro: "Veículo não encontrado.",
            });
        }
        return res.json({
            ok: true,
            veiculo,
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
router.patch("/:id", exigirAdmin, async (req, res) => {
    const resultadoParams = idVeiculoSchema.safeParse(req.params);
    if (!resultadoParams.success) {
        return res
            .status(400)
            .json({
            ok: false,
            erro: "ID inválido."
        });
    }
    const resultadoBody = atualizarVeiculoSchema.safeParse(req.body);
    if (!resultadoBody.success) {
        return res
            .status(400)
            .json({
            ok: false,
            erro: "Dados do veículo inválidos.",
            campos: formatarErrosZod(resultadoBody.error),
        });
    }
    const { id } = resultadoParams.data;
    const dados = resultadoBody.data;
    const dadosAtualizacao = {
        ...(dados.nome !== undefined
            ? { nome: dados.nome }
            : {}),
        ...(dados.km !== undefined
            ? { km: dados.km }
            : {}),
        ...(dados.cor !== undefined
            ? { cor: dados.cor }
            : {}),
        ...(dados.final_placa !== undefined
            ? { final_placa: dados.final_placa }
            : {}),
        ...(dados.estado_ipva !== undefined
            ? { estado_ipva: dados.estado_ipva }
            : {}),
        ...(dados.preco !== undefined
            ? { preco: dados.preco }
            : {}),
        ...(dados.ano !== undefined
            ? { ano: dados.ano }
            : {}),
        ...(dados.cambio !== undefined
            ? { cambio: dados.cambio }
            : {}),
        ...(dados.motor !== undefined
            ? { motor: dados.motor }
            : {}),
        ...(dados.combustivel !== undefined
            ? { combustivel: dados.combustivel }
            : {}),
        ...(dados.descricao !== undefined
            ? { descricao: dados.descricao }
            : {}),
        ...(dados.outras_infos !== undefined
            ? { outras_infos: dados.outras_infos }
            : {}),
    };
    try {
        const existente = await prisma.veiculo.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });
        if (!existente) {
            return res
                .status(404)
                .json({
                ok: false,
                erro: "Veículo não encontrado.",
            });
        }
        const veiculoAtualizado = await prisma.veiculo.update({
            where: {
                id,
            },
            data: dadosAtualizacao,
        });
        return res.json({
            ok: true,
            mensagem: "Veículo atualizado com sucesso.",
            veiculo: veiculoAtualizado,
        });
    }
    catch (error) {
        console.error("Erro ao editar veículo:", error);
        return res
            .status(500)
            .json({
            ok: false,
            erro: "Erro inesperado ao editar veículo.",
        });
    }
});
/* Rota para indicar veículos como vendidos */
router.patch("/:id/vendido", exigirAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) ||
        id <= 0) {
        return res.status(400).json({
            ok: false,
            erro: "ID inválido.",
        });
    }
    try {
        const veiculo = await prisma.veiculo
            .findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                imagens: {
                    select: {
                        url: true,
                    },
                },
            },
        });
        if (!veiculo) {
            return res
                .status(404)
                .json({
                ok: false,
                erro: "Veículo não encontrado.",
            });
        }
        const caminhosImagens = veiculo.imagens
            .map((imagem) => extrairCaminhoStorageDaUrl(imagem.url))
            .filter((caminho) => caminho !==
            null);
        await prisma.$transaction(async (tx) => {
            await tx.veiculo.delete({
                where: {
                    id,
                },
            });
            await incrementarVendaDoDia(tx);
        });
        /*
         * 4. Depois que o banco confirmou,
         * remove os arquivos físicos.
         */
        let avisoStorage;
        if (caminhosImagens.length >
            0) {
            const { error: erroStorage, } = await supabase.storage
                .from("Imagens")
                .remove(caminhosImagens);
            if (erroStorage) {
                console.error("Erro ao remover imagens do Storage:", erroStorage);
                avisoStorage =
                    "O veículo foi removido, mas algumas imagens não puderam ser apagadas do armazenamento.";
            }
        }
        return res.json({
            ok: true,
            mensagem: "Veículo vendido e removido com sucesso.",
            ...(avisoStorage
                ? {
                    aviso: avisoStorage,
                }
                : {}),
        });
    }
    catch (error) {
        console.error("Erro ao marcar veículo como vendido:", error);
        return res
            .status(500)
            .json({
            ok: false,
            erro: "Erro ao remover o veículo vendido.",
        });
    }
});
export default router;
//# sourceMappingURL=rotas.js.map