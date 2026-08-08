import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BillingSettings } from "@/components/BillingSettings";

export default async function BillingSettingsPage() {
  const session = await getServerSession(authOptions);
  const practice = await prisma.practice.findUnique({
    where: { id: session!.user.practiceId },
    select: { gozPunktwertCent: true, bemaPunktwertCent: true },
  });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Abrechnung</h1>
      <BillingSettings
        initialGozPunktwertCent={practice?.gozPunktwertCent ?? null}
        initialBemaPunktwertCent={practice?.bemaPunktwertCent ?? null}
      />
    </div>
  );
}
