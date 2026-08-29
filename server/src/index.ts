import "dotenv/config";

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import { rateLimit } from "express-rate-limit";

import veiculosRoutes from "./routes/rotas.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

//Configurações gerais
app.disable("x-powered-by");

//CORS
const origensPermitidas = [
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: origensPermitidas,

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

//Headers de segurança
app.use(
  helmet({
    strictTransportSecurity:
      isProduction
        ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false,
        }
        : false,

      contentSecurityPolicy: {
        directives: {
          "upgrade-insecure-requests":
            isProduction
              ? []
              : null,
        },
      },
  })
);

//Rate limit geral
const limiteGeral = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 300,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    ok: false,
    erro: "Muitas requisições. Tente novamente em alguns minutos.",
  },
});

app.use(limiteGeral);

//Body parser
app.use(
  express.json({
    limit: "1mb",
  })
);

//Rotas
app.use("/veiculos", veiculosRoutes);

//Rota inexistente
app.use(
  (
    req: Request,
    res: Response
  ) => {
    return res
      .status(404)
      .json({
        ok: false,
        erro: "Rota não encontrada.",
      });
  }
);

//Tratamento global de erros
app.use(
  (
    erro: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    //Erros do Multer
    if (erro instanceof multer.MulterError) {
      if (erro.code === "LIMIT_FILE_SIZE") {
        return res
          .status(403)
          .json({
            ok: false,
            erro: "Uma das imagens excede o limite de 8MB.",
          });
      }

      if (erro.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .json({
            ok: false,
            erro: "O limite é de 20 imagens por envio.",
          });
      }

      if (erro.code === "LIMIT_PART_COUNT") {
        return res
          .status(400)
          .json({
            ok: false,
            erro: "A requisição de upload possui partes demais.",
          });
      }

      if (erro.code === "LIMIT_FIELD_COUNT") {
        return res
          .status(400)
          .json({
            ok: false,
            erro: "A requisição possui campos demais.",
          })
      }

      if (erro.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({
            ok: false,
            erro: "Arquivo inesperado no upload.",
          });
      }

      return res
        .status(400)
        .json({
          ok: false,
          erro: "Upload inválido.",
        });
    }

    //Tipo de arquivo rejeitado
    if (
      erro instanceof Error &&
      erro.message === "Formato de imagem não permitido. Utilize JPG, PNG ou WebP."
    ) {
      return res
        .status(400)
        .json({
          ok: false,
          erro: "Formato de imagem não permitido. Utilize JPG, PNG ou WebP.",
        });
    }

    //Erros do express
    if (erro instanceof Error) {
      const erroHttp =
        erro as Error & {
          type?: string;
          status?: number;
        };
      
        if (erroHttp.type === "entity.too.large") {
          return res
            .status(413)
            .json({
              ok: false,
              erro: "A requisição excede o tamanho permitido.",
            });
        }

        if (erroHttp.type === "entity.parse.failed") {
          return res
            .status(400)
            .json({
              ok: false,
              erro: "JSON inválido.",
            });
        }
    }

    console.error("Erro não tratado:", erro);

    return res
      .status(500)
      .json({
        ok: false,
        erro: "Erro interno do servidor.",
      });
  }
);

//Servidor
const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});