import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import { REPORT_TYPE_LABELS } from "@/lib/reportLabels";

interface ReportPdfInput {
  practiceName: string;
  authorName: string;
  patientName: string;
  patientBirthDate: string | null;
  reportType: string;
  treatmentDate: string | null;
  createdAt: string;
  text: string;
}

export async function buildReportPdf(input: ReportPdfInput): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 56 });
  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  doc.pipe(stream);
  stream.on("data", (chunk) => chunks.push(chunk as Buffer));

  doc.fontSize(16).font("Helvetica-Bold").text(input.practiceName);
  doc.moveDown(0.5);
  doc.fontSize(11).font("Helvetica").fillColor("#555555");
  doc.text(REPORT_TYPE_LABELS[input.reportType] ?? input.reportType);
  doc.moveDown(1);

  doc.fillColor("#000000").fontSize(10);
  doc.text(`Patient: ${input.patientName}`);
  if (input.patientBirthDate) doc.text(`Geburtsdatum: ${input.patientBirthDate}`);
  if (input.treatmentDate) doc.text(`Behandlungsdatum: ${input.treatmentDate}`);
  doc.text(`Erstellt am: ${input.createdAt}`);
  doc.text(`Verfasst von: ${input.authorName}`);
  doc.moveDown(1.5);

  doc.fontSize(11).font("Helvetica").text(input.text, { align: "left", lineGap: 4 });

  doc.end();

  return await new Promise<Buffer>((resolve, reject) => {
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
