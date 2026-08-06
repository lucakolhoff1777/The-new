import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

export type ReportType = "BEFUND" | "KRANKENKASSE";

interface GenerateReportInput {
  reportType: ReportType;
  practiceName: string;
  authorName: string;
  patient: {
    firstName: string;
    lastName: string;
    birthDate: string | null;
    insuranceName: string | null;
    insuranceNumber: string | null;
  };
  treatmentDate: string | null;
  serviceSummary: string;
  additionalContext: string | null;
}

const TYPE_INSTRUCTIONS: Record<ReportType, string> = {
  BEFUND: `Verfasse einen Befund- und Behandlungsbericht für die Patientenakte bzw. zur Weitergabe an
mit- oder weiterbehandelnde Kolleg:innen. Gliedere in: Anrede/Betreff (falls an eine andere Praxis
gerichtet, sonst neutraler Titel), Befund, durchgeführte Behandlung, ggf. Empfehlung / weiteres
Vorgehen. Sachlicher, präziser zahnmedizinischer Fachstil.`,
  KRANKENKASSE: `Verfasse ein formelles Schreiben an die gesetzliche/private Krankenkasse zur Begründung
der medizinischen Notwendigkeit einer Behandlung bzw. zur Beantragung der Kostenübernahme/-erstattung.
Gliedere in: Anschrift/Betreff, Anrede, kurze Darstellung des Befunds, Begründung der medizinischen
Notwendigkeit der geplanten bzw. durchgeführten Behandlung, konkrete Bitte (z. B. um Kostenübernahme
oder Genehmigung), Grußformel. Formeller, überzeugender, aber sachlicher Stil, wie er gegenüber
Kostenträgern üblich ist.`,
};

function buildPrompt(input: GenerateReportInput): string {
  const { patient } = input;
  return `Praxis: ${input.practiceName}
Verfasst von: ${input.authorName}
Patient: ${patient.firstName} ${patient.lastName}
Geburtsdatum: ${patient.birthDate ?? "nicht angegeben"}
Krankenkasse: ${patient.insuranceName ?? "nicht angegeben"}${
    patient.insuranceNumber ? ` (Versichertennummer: ${patient.insuranceNumber})` : ""
  }
Behandlungsdatum: ${input.treatmentDate ?? "nicht angegeben"}

Erfasste, tatsächlich erbrachte Leistungen dieser Sitzung (geprüfte Leistungserfassung der Praxis):
${input.serviceSummary}

${
    input.additionalContext
      ? `Zusätzlicher Kontext (ggf. eine kurze, diktierte Notiz der Praxis - formuliere sie sinngemäß
etwas ausführlicher aus, ohne neue Fakten hinzuzuerfinden):\n${input.additionalContext}\n`
      : ""
  }
Erstelle daraus jetzt den vollständigen Bericht.`;
}

export async function generateReportText(input: GenerateReportInput): Promise<string> {
  const systemPrompt = `Du unterstützt eine Zahnarztpraxis dabei, professionelle schriftliche Berichte zu
verfassen. Du bekommst strukturierte Angaben und Stichpunkte der Praxis und formulierst daraus einen
fertigen, gut lesbaren Bericht auf Deutsch.

${TYPE_INSTRUCTIONS[input.reportType]}

Wichtige Regeln:
- Nutze ausschließlich die gegebenen Informationen. Erfinde keine Diagnosen, Befunde, Maßnahmen,
  Zähne/Zahnschemata, Daten oder Zahlen, die nicht genannt wurden.
- Falls für den Berichtstyp üblicherweise eine Angabe fehlt (z. B. Zahnnummer, genaues Datum), lass an
  der Stelle einen Platzhalter in eckigen Klammern stehen, z. B. [Zahnnummer ergänzen], statt zu raten.
- Schreibe im Fließtext bzw. mit klaren Absätzen, keine rohe Stichpunktliste, sofern es sich nicht um
  eine tabellarische Aufstellung handelt.
- Gib ausschließlich den fertigen Berichtstext zurück, ohne einleitende Kommentare wie "Hier ist der Bericht:".
- Der "Zusätzliche Kontext" ist oft eine kurze, ggf. diktierte Stichnotiz. Arbeite ihren Inhalt
  sinngemäß und etwas ausführlicher in den Bericht ein, aber halte dich dabei an die oben
  vorgegebene Gliederung/Struktur des Berichtstyps - die Kürze der Notiz rechtfertigt keine
  Abweichung vom üblichen Aufbau.
- Der Bericht ist ein Entwurf und wird vor Versand von einer approbierten Zahnärztin / einem approbierten
  Zahnarzt geprüft und freigegeben.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Keine Textantwort vom KI-Modell erhalten.");
  }

  return textBlock.text.trim();
}
