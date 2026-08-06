import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REPORT_TYPE_LABELS, REPORT_STATUS_LABELS } from "@/lib/reportLabels";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const patient = await prisma.patient.findFirst({
    where: { id: params.id, practiceId: session!.user.practiceId },
    include: {
      reports: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!patient) notFound();

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {patient.birthDate
              ? `geb. ${patient.birthDate.toLocaleDateString("de-DE")}`
              : "Kein Geburtsdatum hinterlegt"}
            {patient.insuranceName ? ` · ${patient.insuranceName}` : ""}
          </p>
        </div>
        <Link href={`/reports/new?patientId=${patient.id}`} className="btn-primary">
          Neuer Bericht
        </Link>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Berichte
      </h2>
      {patient.reports.length === 0 ? (
        <div className="card text-sm text-slate-500">
          Für diesen Patienten wurde noch kein Bericht erstellt.
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 p-0">
          {patient.reports.map((r) => (
            <Link
              key={r.id}
              href={`/reports/${r.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">{REPORT_TYPE_LABELS[r.type]}</p>
                <p className="text-sm text-slate-500">
                  {r.createdAt.toLocaleDateString("de-DE")} · von {r.author.name}
                </p>
              </div>
              <span
                className={
                  r.status === "FINAL"
                    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    : "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
                }
              >
                {REPORT_STATUS_LABELS[r.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
