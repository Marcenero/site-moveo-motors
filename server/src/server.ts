import express from "express";
import cors from "cors";

import veiculosRoutes from "./routes/veiculos.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/veiculos", veiculosRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});