/*
  Warnings:

  - You are about to drop the `Carro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Carro";

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "final_placa" INTEGER NOT NULL,
    "estado_IPVA" BOOLEAN NOT NULL DEFAULT false,
    "preco" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "cambio" TEXT NOT NULL,
    "motor" TEXT NOT NULL,
    "combustivel" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "outras_infos" TEXT[],

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagemVeiculo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "veiculoId" INTEGER NOT NULL,

    CONSTRAINT "ImagemVeiculo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImagemVeiculo" ADD CONSTRAINT "ImagemVeiculo_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
