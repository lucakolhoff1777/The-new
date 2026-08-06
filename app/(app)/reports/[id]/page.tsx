import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportEditor } from "@/components/ReportEditor";

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const report = await prisma.report.findFirst({
    where: { id: params.id, practiceId: session!.user.practiceId },
    include: { patient: true, author: { select: { name: true } } },
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
          bulletPoints: report.bulletPoints,
          additionalContext: report.additionalContext,
          patient: { firstName: report.patient.firstName, lastName: report.patient.lastName },
          author: { name: report.author.name },
          createdAt: report.createdAt.toLocaleDateString("de-DE"),
        }}
      />
    </div>
  );
}
