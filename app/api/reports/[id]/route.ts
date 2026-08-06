import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const report = await prisma.report.findFirst({
    where: { id: params.id, practiceId: session.user.practiceId },
    include: { patient: true, author: { select: { name: true } } },
  });
  if (!report) return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });

  return NextResponse.json({ report });
}

const updateSchema = z.object({
  editedText: z.string().min(1).optional(),
  status: z.enum(["ENTWURF", "FINAL"]).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const existing = await prisma.report.findFirst({
    where: { id: params.id, practiceId: session.user.practiceId },
  });
  if (!existing) return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });

  const report = await prisma.report.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ report });
}
