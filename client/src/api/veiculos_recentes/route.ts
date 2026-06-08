import { NextResponse } from "next/server";
import { prisma } from "../../../../server/src/lib/prisma";

export async function GET() {
  const veiculos = await prisma.veiculo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return NextResponse.json(veiculos);
}