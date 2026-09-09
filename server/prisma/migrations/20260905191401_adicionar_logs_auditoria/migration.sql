/*
  Warnings:

  - You are about to drop the column `estado_IPVA` on the `Veiculo` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Veiculo` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Veiculo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('ADMIN_LOGIN', 'VEICULO_CRIADO', 'VEICULO_ATUALIZADO', 'VEICULO_VENDIDO', 'IMAGENS_UPLOAD');

-- CreateEnum
CREATE TYPE "ResultadoAuditoria" AS ENUM ('SUCESSO', 'FALHA');

-- AlterTable
ALTER TABLE "Veiculo" DROP COLUMN "estado_IPVA",
DROP COLUMN "name",
ADD COLUMN     "estado_ipva" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "VendaDia" (
    "id" BIGSERIAL NOT NULL,
    "data" DATE NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendaDia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAuditoria" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao" "AcaoAuditoria" NOT NULL,
    "resultado" "ResultadoAuditoria" NOT NULL,
    "adminId" TEXT NOT NULL,
    "veiculoId" INTEGER,
    "detalhes" JSONB,

    CONSTRAINT "LogAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendaDia_data_key" ON "VendaDia"("data");
