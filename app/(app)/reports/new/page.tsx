import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServiceChecklistForm } from "@/components/ServiceChecklistForm";

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: { patientId?: string };
}) {
  const session = await getServerSession(authOptions);

  const patients = await prisma.patient.findMany({
    where: { practiceId: session!.user.practiceId },
    orderBy: { lastName: "asc" },
    select: { id: true, firstName: true, lastName: true, insuranceType: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Neuer Bericht</h1>
      <ServiceChecklistForm patients={patients} initialPatientId={searchParams.patientId} />
    </div>
  );
}
