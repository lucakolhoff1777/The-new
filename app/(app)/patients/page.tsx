import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  const patients = await prisma.patient.findMany({
    where: { practiceId: session!.user.practiceId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Patienten</h1>
        <Link href="/patients/new" className="btn-primary">Neuer Patient</Link>
      </div>

      {patients.length === 0 ? (
        <div className="card text-sm text-slate-500">
          Noch keine Patienten angelegt.{" "}
          <Link href="/patients/new" className="font-medium text-brand-600 hover:underline">
            Ersten Patienten anlegen
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 p-0">
          {patients.map((p) => (
            <Link
              key={p.id}
              href={`/patients/${p.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {p.firstName} {p.lastName}
                </p>
                {p.insuranceName && (
                  <p className="text-sm text-slate-500">{p.insuranceName}</p>
                )}
              </div>
              <span className="text-sm text-brand-600">Öffnen →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
