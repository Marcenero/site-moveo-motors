-- AlterTable
ALTER TABLE "ImagemVeiculo" ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;

WITH posicoes AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "veiculoId"
            ORDER BY "id"
        ) - 1 AS nova_ordem
    FROM "ImagemVeiculo"
)
UPDATE "ImagemVeiculo" AS imagem
SET "ordem" = posicoes.nova_ordem
FROM posicoes
WHERE imagem."id" = posicoes."id";