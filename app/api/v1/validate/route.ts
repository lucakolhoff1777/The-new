import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateAndRateLimitApiRequest } from "@/lib/apiAuth";
import { validateFaktor, validateGueltigkeit, findExclusionConflicts } from "@/lib/serviceRules";

const entrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  performed: z.boolean(),
  faktor: z.number().min(0).max(10).optional().nullable(),
  begruendung: z.string().optional().nullable(),
  faktorMin: z.number().optional().nullable(),
  faktorMax: z.number().optional().nullable(),
  regelhoechstfaktor: z.number().optional().nullable(),
  begruendungspflichtAbFaktor: z.number().optional().nullable(),
  ausschlussMit: z.array(z.string()).optional().default([]),
  gueltigAb: z.string().optional().nullable(),
  gueltigBis: z.string().optional().nullable(),
  // Da Partner-Patientendaten hier nicht persistiert werden, muss der
  // Partner selbst mitgeben, wie oft diese Position im relevanten Zeitraum
  // bereits abgerechnet wurde, damit das Frequenzlimit geprüft werden kann.
  frequenzlimitAnzahl: z.number().int().optional().nullable(),
  frequenzlimitZeitraumTage: z.number().int().optional().nullable(),
  priorCount: z.number().int().min(0).optional().nullable(),
});

const validateSchema = z.object({
  treatmentDate: z.string().optional().nullable(),
  entries: z.array(entrySchema).min(1),
});

// Stellt dieselbe Validierungs-Engine (Faktor-/Begründungspflicht,
// Ausschluss-Regeln, Gültigkeitszeitraum, Frequenzlimit), die intern für
// die eigene Leistungserfassung genutzt wird, als zustandslosen Service für
// Partner-PVS-Systeme bereit - Partner bringen ihre eigenen Positions- und
// Patientendaten mit, wir persistieren nichts davon.
export async function POST(req: Request) {
  const auth = await authenticateAndRateLimitApiRequest(req);
  if (!auth.client) {
    return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = validateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const { treatmentDate, entries } = parsed.data;
  const treatmentDateObj = treatmentDate ? new Date(treatmentDate) : null;
  const errors: Array<{ entryId: string; message: string }> = [];

  for (const e of entries) {
    if (!e.performed) continue;

    const faktorError = validateFaktor(
      e.faktor,
      e.begruendung,
      {
        faktorMin: e.faktorMin ?? null,
        faktorMax: e.faktorMax ?? null,
        regelhoechstfaktor: e.regelhoechstfaktor ?? null,
        begruendungspflichtAbFaktor: e.begruendungspflichtAbFaktor ?? null,
      },
      e.title
    );
    if (faktorError) errors.push({ entryId: e.id, message: faktorError });

    const gueltigkeitError = validateGueltigkeit(
      treatmentDateObj,
      {
        gueltigAb: e.gueltigAb ? new Date(e.gueltigAb) : null,
        gueltigBis: e.gueltigBis ? new Date(e.gueltigBis) : null,
      },
      e.title
    );
    if (gueltigkeitError) errors.push({ entryId: e.id, message: gueltigkeitError });

    if (
      e.frequenzlimitAnzahl != null &&
      e.priorCount != null &&
      e.priorCount >= e.frequenzlimitAnzahl
    ) {
      errors.push({
        entryId: e.id,
        message: `"${e.title}" wurde laut übermittelter Historie bereits ${e.priorCount}x abgerechnet (Limit: ${e.frequenzlimitAnzahl}x je ${e.frequenzlimitZeitraumTage ?? "?"} Tage).`,
      });
    }
  }

  const itemsById = new Map(
    entries.map((e) => [e.id, { id: e.id, title: e.title, ausschlussMit: e.ausschlussMit ?? [] }])
  );
  const performedIds = entries.filter((e) => e.performed).map((e) => e.id);
  const conflicts = findExclusionConflicts(performedIds, itemsById);
  for (const conflict of conflicts) {
    errors.push({
      entryId: conflict.a.id,
      message: `"${conflict.a.title}" und "${conflict.b.title}" dürfen laut Katalog nicht gemeinsam abgerechnet werden.`,
    });
  }

  return NextResponse.json({ valid: errors.length === 0, errors });
}
