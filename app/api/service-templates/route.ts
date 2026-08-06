import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const templates = await prisma.serviceTemplate.findMany({
    where: {
      OR: [{ practiceId: null }, { practiceId: session.user.practiceId }],
    },
    orderBy: { name: "asc" },
    include: {
      items: {
        orderBy: { position: "asc" },
        include: { catalogItem: true },
      },
    },
  });

  return NextResponse.json({ templates });
}
