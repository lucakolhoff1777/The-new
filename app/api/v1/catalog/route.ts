import { NextResponse } from "next/server";
import { authenticateAndRateLimitApiRequest } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { parseDependsOn } from "@/lib/serviceDependency";

// Referenzkatalog + Vorlagen als Nachschlagedaten für Partner, die die
// eigene Ziffern-/Vorlagenstruktur mit unserer abgleichen oder direkt
// übernehmen möchten. Nur die globalen (praxisunabhängigen) Positionen -
// keine Praxis- oder Patientendaten.
export async function GET(req: Request) {
  const auth = await authenticateAndRateLimitApiRequest(req);
  if (!auth.client) {
    return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });
  }

  const [catalogItems, templates] = await Promise.all([
    prisma.serviceCatalogItem.findMany({ where: { practiceId: null } }),
    prisma.serviceTemplate.findMany({
      where: { practiceId: null },
      orderBy: { name: "asc" },
      include: { items: { orderBy: { position: "asc" } } },
    }),
  ]);

  return NextResponse.json({
    catalog: catalogItems.map((c) => ({
      id: c.id,
      system: c.system,
      code: c.code,
      title: c.title,
      description: c.description,
      category: c.category,
      toothRelevant: c.toothRelevant,
      faktorMin: c.faktorMin,
      faktorMax: c.faktorMax,
      regelhoechstfaktor: c.regelhoechstfaktor,
      begruendungspflichtAbFaktor: c.begruendungspflichtAbFaktor,
      ausschlussMit: parseDependsOn(c.ausschlussMit),
      frequenzlimitAnzahl: c.frequenzlimitAnzahl,
      frequenzlimitZeitraumTage: c.frequenzlimitZeitraumTage,
      gueltigAb: c.gueltigAb,
      gueltigBis: c.gueltigBis,
    })),
    templates: templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      items: t.items.map((i) => ({
        catalogItemId: i.catalogItemId,
        position: i.position,
        dependsOn: parseDependsOn(i.dependsOn),
      })),
    })),
  });
}
