import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportEditor } from "@/components/ReportEditor";

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const report = await prisma.report.findFirst({
    where: { id: params.id, practiceId: session!.user.practiceId },
    include: {
      patient: true,
      author: { select: { name: true } },
      serviceTemplate: { select: { name: true } },
      serviceEntries: {
        orderBy: { position: "asc" },
        include: { catalogItem: true },
      },
    },
  });

  if (!report) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <ReportEditor
        report={{
          id: report.id,
          type: report.type,
          status: report.status as "ENTWURF" | "FINAL",
          generatedText: report.generatedText,
          editedText: report.editedText,
          serviceSummary: report.serviceSummary,
          serviceTemplateName: report.serviceTemplate?.name ?? null,
          reviewConfirmed: report.reviewConfirmed,
          serviceEntries: report.serviceEntries.map((entry) => ({
            id: entry.id,
            performed: entry.performed,
            toothNumbers: entry.toothNumbers,
            quantity: entry.quantity,
            note: entry.note,
            catalogItem: {
              system: entry.catalogItem.system,
              code: entry.catalogItem.code,
              title: entry.catalogItem.title,
              category: entry.catalogItem.category,
            },
          })),
          additionalContext: report.additionalContext,
          patient: { firstName: report.patient.firstName, lastName: report.patient.lastName },
          author: { name: report.author.name },
          createdAt: report.createdAt.toLocaleDateString("de-DE"),
        }}
      />
    </div>
  );
}
