import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// Bewusst eng begrenzt: nur punktzahl/festbetragCent sind editierbar, alles
// andere an einer Katalogposition (Titel, Faktor-Regeln, Abhängigkeiten
// usw.) bleibt Sache von prisma/seed.ts, um die inhaltliche Pflege des
// Katalogs nicht versehentlich über die UI aufzuweichen.
const updateSchema = z.object({
  punktzahl: z.number().min(0).max(100000).optional().nullable(),
  festbetragCent: z.number().int().min(0).optional().nullable(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAdmin();
  if (!session) return error;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const existing = await prisma.serviceCatalogItem.findFirst({
    where: { id: params.id, practiceId: null },
  });
  if (!existing) {
    return NextResponse.json({ error: "Katalogposition nicht gefunden" }, { status: 404 });
  }

  const item = await prisma.serviceCatalogItem.update({
    where: { id: params.id },
    data: parsed.data,
    select: { id: true, punktzahl: true, festbetragCent: true },
  });

  return NextResponse.json({ item });
}
