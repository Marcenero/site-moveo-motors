-- CreateTable
CREATE TABLE "Carro" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carro_pkey" PRIMARY KEY ("id")
);
