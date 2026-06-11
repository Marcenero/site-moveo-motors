import "dotenv/config";

import express from "express";
import cors from "cors";

import veiculosRoutes from "./routes/veiculos.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(express.json());

app.use("/veiculos", veiculosRoutes);

const PORT = process.env.PORT || 3001;

app.listen(3001, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});