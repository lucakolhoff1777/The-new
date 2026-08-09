import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateAndRateLimitApiRequest } from "@/lib/apiAuth";
import { generateReportText } from "@/lib/anthropic";
import { buildServiceSummary } from "@/lib/serviceSummary";

const entrySchema = z.object({
  system: z.string().min(1),
  code: z.string().min(1),
  title: z.string().min(1),
  performed: z.boolean(),
  toothNumbers: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  note: z.string().optional().nullable(),
});

const generateSchema = z.object({
  reportType: z.enum(["BEFUND", "KRANKENKASSE"]),
  practiceName: z.string().min(1),
  authorName: z.string().min(1),
  patient: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().optional().nullable(),
    insuranceName: z.string().optional().nullable(),
    insuranceNumber: z.string().optional().nullable(),
  }),
  treatmentDate: z.string().optional().nullable(),
  entries: z.array(entrySchema).min(1),
  additionalContext: z.string().optional().nullable(),
});

// KI-Berichtsgenerierung als Service: der Partner liefert bereits geprüfte
// (z. B. über /api/v1/validate freigegebene), strukturierte Leistungsdaten
// - Patienten-/Behandlungsdaten werden ausschließlich für diesen einen
// Aufruf verwendet und nicht gespeichert.
export async function POST(req: Request) {
  const auth = await authenticateAndRateLimitApiRequest(req);
  if (!auth.client) {
    return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const { reportType, practiceName, authorName, patient, treatmentDate, entries, additionalContext } =
    parsed.data;

  const serviceSummary = buildServiceSummary(
    entries.map((e) => ({
      performed: e.performed,
      toothNumbers: e.toothNumbers ?? null,
      quantity: e.quantity,
      note: e.note ?? null,
      catalogItem: { system: e.system, code: e.code, title: e.title },
    }))
  );

  try {
    const text = await generateReportText({
      reportType,
      practiceName,
      authorName,
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthDate: patient.birthDate ?? null,
        insuranceName: patient.insuranceName ?? null,
        insuranceNumber: patient.insuranceNumber ?? null,
      },
      treatmentDate: treatmentDate ?? null,
      serviceSummary,
      additionalContext: additionalContext || null,
    });

    return NextResponse.json({ text, serviceSummary });
  } catch (err) {
    console.error("Fehler bei der API-Berichtsgenerierung:", err);
    return NextResponse.json(
      { error: "Der Bericht konnte nicht generiert werden. Bitte versuchen Sie es erneut." },
      { status: 502 }
    );
  }
}
