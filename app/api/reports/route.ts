import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReportText } from "@/lib/anthropic";

const createSchema = z.object({
  patientId: z.string().min(1),
  type: z.enum(["BEFUND", "KRANKENKASSE"]),
  treatmentDate: z.string().optional().nullable(),
  bulletPoints: z.string().min(3, "Bitte Stichpunkte zum Befund/zur Behandlung angeben"),
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

  const { patientId, type, treatmentDate, bulletPoints, additionalContext } = parsed.data;

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, practiceId: session.user.practiceId },
  });
  if (!patient) {
    return NextResponse.json({ error: "Patient nicht gefunden" }, { status: 404 });
  }

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
      bulletPoints,
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
      bulletPoints,
      additionalContext: additionalContext || null,
      generatedText,
    },
  });

  return NextResponse.json({ report });
}
