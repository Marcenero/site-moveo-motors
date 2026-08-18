import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import veiculosRoutes from "./routes/veiculos.js";

const app = express();

//Configurações gerais
app.disable("x-powered-by");

app.use(
  helmet()
);

//CORS
const origensPermitidas = [
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const isProduction = process.env.NODE_ENV === "production";

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
  }),

  helmet({
    strictTransportSecurity: isProduction
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
    error: "Muitas requisições. Tente novamente em alguns minutos.",
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

//Servidor
const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});