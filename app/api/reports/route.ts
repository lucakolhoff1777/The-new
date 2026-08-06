import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReportText } from "@/lib/anthropic";
import { buildServiceSummary } from "@/lib/serviceSummary";
import { computeEffectivePerformed, parseDependsOn } from "@/lib/serviceDependency";
import { validateFaktor, findExclusionConflicts } from "@/lib/serviceRules";

const entrySchema = z.object({
  catalogItemId: z.string().min(1),
  performed: z.boolean(),
  toothNumbers: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  note: z.string().optional().nullable(),
  faktor: z.number().min(0).max(10).optional().nullable(),
  begruendung: z.string().optional().nullable(),
});

const createSchema = z.object({
  patientId: z.string().min(1),
  type: z.enum(["BEFUND", "KRANKENKASSE"]),
  treatmentDate: z.string().optional().nullable(),
  serviceTemplateId: z.string().min(1),
  entries: z.array(entrySchema).min(1),
  reviewConfirmed: z.boolean(),
  additionalContext: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const { patientId, type, treatmentDate, serviceTemplateId, entries, reviewConfirmed, additionalContext } =
    parsed.data;

  if (!reviewConfirmed) {
    return NextResponse.json(
      { error: "Bitte bestätigen Sie, dass die Leistungsliste vollständig geprüft wurde." },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, practiceId: session.user.practiceId },
  });
  if (!patient) {
    return NextResponse.json({ error: "Patient nicht gefunden" }, { status: 404 });
  }

  const template = await prisma.serviceTemplate.findFirst({
    where: {
      id: serviceTemplateId,
      OR: [{ practiceId: null }, { practiceId: session.user.practiceId }],
    },
    include: { items: true },
  });
  if (!template) {
    return NextResponse.json({ error: "Leistungsvorlage nicht gefunden" }, { status: 404 });
  }

  // Lückenlosigkeit erzwingen: jede Position der Vorlage muss genau einmal
  // in den eingereichten Einträgen enthalten sein - keine Position darf
  // fehlen oder unentschieden bleiben.
  const requiredItemIds = new Set(template.items.map((i) => i.catalogItemId));
  const submittedItemIds = new Set(entries.map((e) => e.catalogItemId));

  if (requiredItemIds.size !== submittedItemIds.size) {
    return NextResponse.json(
      { error: "Leistungsliste ist unvollständig oder enthält unbekannte Positionen." },
      { status: 400 }
    );
  }
  for (const id of requiredItemIds) {
    if (!submittedItemIds.has(id)) {
      return NextResponse.json(
        { error: "Leistungsliste ist unvollständig: Es fehlt mindestens eine Position der Vorlage." },
        { status: 400 }
      );
    }
  }

  const catalogItems = await prisma.serviceCatalogItem.findMany({
    where: { id: { in: Array.from(requiredItemIds) } },
  });
  const catalogItemById = new Map(catalogItems.map((c) => [c.id, c]));

  // Serverseitige Absicherung der Abhängigkeitsketten: unabhängig davon, was
  // der Client als "performed" meldet, wird hier neu berechnet, ob eine
  // Position angesichts ihrer Voraussetzungen tatsächlich stattgefunden
  // haben kann. Ein manipulierter Request kann die Kaskade damit nicht
  // umgehen.
  const ownPerformedById: Record<string, boolean> = {};
  entries.forEach((e) => {
    ownPerformedById[e.catalogItemId] = e.performed;
  });
  const dependencyItems = template.items.map((i) => ({
    id: i.catalogItemId,
    dependsOn: parseDependsOn(i.dependsOn),
  }));
  const effectiveById = computeEffectivePerformed(dependencyItems, ownPerformedById);

  const entriesWithCatalog = entries.map((e) => {
    const catalogItem = catalogItemById.get(e.catalogItemId);
    if (!catalogItem) throw new Error("Unbekannte Katalogposition");
    return {
      performed: effectiveById[e.catalogItemId] ?? false,
      toothNumbers: e.toothNumbers ?? null,
      quantity: e.quantity,
      note: e.note ?? null,
      catalogItem,
    };
  });

  // Faktor-Regeln (§5 GOZ-Logik): Faktor muss im erlaubten Bereich liegen,
  // und ab dem Regelhöchstfaktor ist eine schriftliche Begründung Pflicht.
  for (const e of entries) {
    if (!(effectiveById[e.catalogItemId] ?? false)) continue;
    const catalogItem = catalogItemById.get(e.catalogItemId);
    if (!catalogItem) continue;
    const error = validateFaktor(e.faktor, e.begruendung, catalogItem, catalogItem.title);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  // Ausschluss-Regeln: nicht gleichzeitig abrechenbare Positionen dürfen
  // nicht beide effektiv erbracht sein (z. B. zwei Füllungsarten am selben
  // Zahn in derselben Sitzung).
  const exclusionItemsById = new Map(
    catalogItems.map((c) => [c.id, { id: c.id, title: c.title, ausschlussMit: parseDependsOn(c.ausschlussMit) }])
  );
  const performedIds = entries
    .filter((e) => effectiveById[e.catalogItemId] ?? false)
    .map((e) => e.catalogItemId);
  const conflicts = findExclusionConflicts(performedIds, exclusionItemsById);
  if (conflicts.length > 0) {
    const { a, b } = conflicts[0];
    return NextResponse.json(
      {
        error: `"${a.title}" und "${b.title}" dürfen laut Katalog nicht gemeinsam abgerechnet werden. Bitte eine der beiden Positionen streichen.`,
      },
      { status: 400 }
    );
  }

  const serviceSummary = buildServiceSummary(entriesWithCatalog);

  let generatedText: string;
  try {
    generatedText = await generateReportText({
      reportType: type,
      practiceName: session.user.practiceName,
      authorName: session.user.name ?? "",
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthDate: patient.birthDate ? patient.birthDate.toLocaleDateString("de-DE") : null,
        insuranceName: patient.insuranceName,
        insuranceNumber: patient.insuranceNumber,
      },
      treatmentDate: treatmentDate ? new Date(treatmentDate).toLocaleDateString("de-DE") : null,
      serviceSummary,
      additionalContext: additionalContext || null,
    });
  } catch (err) {
    console.error("Fehler bei der Berichtsgenerierung:", err);
    return NextResponse.json(
      { error: "Der Bericht konnte nicht generiert werden. Bitte versuchen Sie es erneut." },
      { status: 502 }
    );
  }

  const report = await prisma.report.create({
    data: {
      practiceId: session.user.practiceId,
      patientId,
      authorId: session.user.id,
      type,
      treatmentDate: treatmentDate ? new Date(treatmentDate) : null,
      serviceTemplateId: template.id,
      serviceSummary,
      reviewConfirmed: true,
      additionalContext: additionalContext || null,
      generatedText,
      serviceEntries: {
        create: entries.map((e, i) => ({
          catalogItemId: e.catalogItemId,
          performed: effectiveById[e.catalogItemId] ?? false,
          toothNumbers: e.toothNumbers || null,
          quantity: e.quantity,
          note: e.note || null,
          faktor: e.faktor ?? null,
          begruendung: e.begruendung || null,
          position: i,
        })),
      },
    },
  });

  return NextResponse.json({ report });
}
