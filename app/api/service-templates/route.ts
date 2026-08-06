import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseDependsOn } from "@/lib/serviceDependency";

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

  const withParsedDeps = templates.map((tpl) => ({
    ...tpl,
    items: tpl.items.map((item) => ({
      ...item,
      dependsOn: parseDependsOn(item.dependsOn),
      catalogItem: {
        ...item.catalogItem,
        ausschlussMit: parseDependsOn(item.catalogItem.ausschlussMit),
      },
    })),
  }));

  return NextResponse.json({ templates: withParsedDeps });
}
