import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Listet den globalen Referenzkatalog (praxisunabhängige Positionen), damit
// die Praxis amtliche Punktzahlen/Festbeträge eintragen kann. Diese Werte
// sind objektiv (Teil des offiziellen Gebührenverzeichnisses) und daher
// bewusst geteilt statt je Praxis dupliziert - siehe Hinweis auf der Seite.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const items = await prisma.serviceCatalogItem.findMany({
    where: { practiceId: null },
    orderBy: [{ category: "asc" }, { title: "asc" }],
    select: {
      id: true,
      system: true,
      code: true,
      title: true,
      category: true,
      punktzahl: true,
      festbetragCent: true,
    },
  });

  return NextResponse.json({ items });
}
