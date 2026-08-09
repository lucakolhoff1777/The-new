import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const patient = await prisma.patient.findFirst({
    where: { id: params.id, practiceId: session.user.practiceId },
    include: {
      reports: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!patient) return NextResponse.json({ error: "Patient nicht gefunden" }, { status: 404 });

  return NextResponse.json({ patient });
}
